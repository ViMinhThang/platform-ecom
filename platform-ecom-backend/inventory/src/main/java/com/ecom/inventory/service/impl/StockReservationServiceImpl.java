package com.ecom.inventory.service.impl;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.InsufficientStockException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.inventory.dto.ReservationRequest;
import com.ecom.inventory.dto.StockReservationDTO;
import com.ecom.inventory.entity.*;
import com.ecom.inventory.helper.InventoryHelper;
import com.ecom.inventory.helper.InventoryTransactionHelper;
import com.ecom.inventory.mapper.InventoryMapper;
import com.ecom.inventory.repository.InventoryRepository;
import com.ecom.inventory.repository.StockReservationRepository;
import com.ecom.inventory.service.signature.StockReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockReservationServiceImpl implements StockReservationService {

    private final InventoryRepository inventoryRepository;
    private final StockReservationRepository reservationRepository;
    private final InventoryHelper inventoryHelper;
    private final InventoryTransactionHelper transactionHelper;
    private final InventoryMapper mapper;

    @Override
    @Transactional
    public StockReservationDTO reserve(ReservationRequest request) {
        Inventory inventory = inventoryHelper.findByVariantIdForUpdateOrThrow(request.getVariantId());
        int durationMinutes = request.getDurationMinutes() != null ? request.getDurationMinutes() : 15;
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(durationMinutes);

        StockReservation existingReservation = reservationRepository
                .findByInventoryIdAndCartIdAndStatus(inventory.getId(), request.getCartId(), ReservationStatus.PENDING)
                .orElse(null);

        if (existingReservation != null) {
            return updateExistingReservation(inventory, existingReservation, request, expiresAt);
        }

        if (!inventory.hasAvailableStock(request.getQuantity())) {
            throw new InsufficientStockException("Insufficient stock for reservation");
        }

        int previousStock = inventory.getTotalStock();
        inventory.setReservedStock(inventory.getReservedStock() + request.getQuantity());
        inventory.recalculateAvailableStock();
        inventoryRepository.save(inventory);

        StockReservation reservation = StockReservation.builder()
                .inventory(inventory)
                .cartId(request.getCartId())
                .userId(request.getUserId())
                .quantity(request.getQuantity())
                .expiresAt(expiresAt)
                .build();

        StockReservation saved = reservationRepository.save(reservation);
        transactionHelper.recordTransaction(inventory, TransactionType.RESERVATION, -request.getQuantity(),
                previousStock, inventory.getTotalStock(), "CART",
                String.valueOf(request.getCartId()), "Reserved stock for checkout", request.getUserId());
        transactionHelper.publishStockUpdatedEvent(inventory, previousStock, TransactionType.RESERVATION,
                "Reserved stock for checkout", request.getUserId());
        transactionHelper.checkAndAlert(inventory);
        log.info("Created reservation {} for variant {} qty {}", saved.getId(), request.getVariantId(),
                request.getQuantity());

        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void confirmReservation(Long reservationId) {
        StockReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", reservationId));

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            log.info("Reservation {} already confirmed", reservationId);
            return;
        }
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Reservation is not pending: " + reservation.getStatus());
        }

        Inventory inventory = inventoryHelper
                .findByVariantIdForUpdateOrThrow(reservation.getInventory().getVariantId());
        int previousStock = inventory.getTotalStock();
        if (previousStock < reservation.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock to confirm reservation " + reservationId);
        }
        if (inventory.getReservedStock() < reservation.getQuantity()) {
            throw new APIException(HttpStatus.CONFLICT, "Reservation quantity exceeds reserved stock");
        }

        // Convert reservation to actual sale
        inventory.setTotalStock(inventory.getTotalStock() - reservation.getQuantity());
        inventory.setReservedStock(inventory.getReservedStock() - reservation.getQuantity());
        inventory.recalculateAvailableStock();

        transactionHelper.recordTransaction(inventory, TransactionType.SALE, -reservation.getQuantity(),
                previousStock, inventory.getTotalStock(), "RESERVATION",
                reservation.getId().toString(), "Reservation confirmed", reservation.getUserId());

        inventoryRepository.save(inventory);
        reservation.confirm();
        reservationRepository.save(reservation);

        transactionHelper.publishStockUpdatedEvent(inventory, previousStock, TransactionType.SALE, "Order confirmed",
                reservation.getUserId());
        transactionHelper.checkAndAlert(inventory);

        log.info("Confirmed reservation {} for variant {}", reservationId, inventory.getVariantId());
    }

    @Override
    @Transactional
    public void cancelReservation(Long reservationId) {
        StockReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            return; // Already cancelled or confirmed
        }

        Inventory inventory = inventoryHelper
                .findByVariantIdForUpdateOrThrow(reservation.getInventory().getVariantId());
        releaseReservationStock(inventory, reservation, TransactionType.RELEASE, "Reservation cancelled");
        reservation.cancel();
        reservationRepository.save(reservation);

        log.info("Cancelled reservation {} for variant {}", reservationId, inventory.getVariantId());
    }

    @Override
    @Transactional
    @Scheduled(fixedRate = 60000) // Run every minute
    public void expireStaleReservations() {
        List<StockReservation> expired = reservationRepository.findExpiredReservations(LocalDateTime.now());

        for (StockReservation reservation : expired) {
            try {
                Inventory inventory = inventoryHelper
                        .findByVariantIdForUpdateOrThrow(reservation.getInventory().getVariantId());

                releaseReservationStock(inventory, reservation, TransactionType.RELEASE, "Reservation expired");
                reservation.expire();
                reservationRepository.save(reservation);

                log.info("Expired reservation {} for variant {}", reservation.getId(), inventory.getVariantId());
            } catch (Exception e) {
                log.error("Error expiring reservation {}: {}", reservation.getId(), e.getMessage());
            }
        }

        if (!expired.isEmpty()) {
            log.info("Expired {} stale reservations", expired.size());
        }
    }

    private StockReservationDTO updateExistingReservation(
            Inventory inventory,
            StockReservation reservation,
            ReservationRequest request,
            LocalDateTime expiresAt) {
        int existingQuantity = reservation.getQuantity();
        int quantityDelta = request.getQuantity() - existingQuantity;

        if (quantityDelta > 0 && !inventory.hasAvailableStock(quantityDelta)) {
            throw new InsufficientStockException("Insufficient stock for reservation");
        }

        int previousStock = inventory.getTotalStock();
        if (quantityDelta != 0) {
            inventory.setReservedStock(inventory.getReservedStock() + quantityDelta);
            inventory.recalculateAvailableStock();
            inventoryRepository.save(inventory);

            TransactionType transactionType = quantityDelta > 0 ? TransactionType.RESERVATION : TransactionType.RELEASE;
            String reason = quantityDelta > 0
                    ? "Increased reservation quantity"
                    : "Reduced reservation quantity";
            transactionHelper.recordTransaction(inventory, transactionType, -quantityDelta,
                    previousStock, inventory.getTotalStock(), "CART",
                    String.valueOf(request.getCartId()), reason, request.getUserId());
            transactionHelper.publishStockUpdatedEvent(inventory, previousStock, transactionType, reason,
                    request.getUserId());
            transactionHelper.checkAndAlert(inventory);
        }

        reservation.setQuantity(request.getQuantity());
        reservation.setUserId(request.getUserId());
        reservation.setExpiresAt(expiresAt);
        StockReservation savedReservation = reservationRepository.save(reservation);

        log.info("Updated pending reservation {} for variant {} qty {}", savedReservation.getId(),
                request.getVariantId(), request.getQuantity());
        return mapper.toDTO(savedReservation);
    }

    private void releaseReservationStock(
            Inventory inventory,
            StockReservation reservation,
            TransactionType transactionType,
            String reason) {
        if (inventory.getReservedStock() < reservation.getQuantity()) {
            throw new APIException(HttpStatus.CONFLICT, "Reservation quantity exceeds reserved stock");
        }

        int previousStock = inventory.getTotalStock();
        inventory.setReservedStock(inventory.getReservedStock() - reservation.getQuantity());
        inventory.recalculateAvailableStock();
        inventoryRepository.save(inventory);

        transactionHelper.recordTransaction(inventory, transactionType, reservation.getQuantity(),
                previousStock, inventory.getTotalStock(), "RESERVATION",
                reservation.getId().toString(), reason, reservation.getUserId());
        transactionHelper.publishStockUpdatedEvent(inventory, previousStock, transactionType, reason,
                reservation.getUserId());
        transactionHelper.checkAndAlert(inventory);
    }
}
