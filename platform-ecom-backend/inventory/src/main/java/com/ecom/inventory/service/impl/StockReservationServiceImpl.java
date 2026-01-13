package com.ecom.inventory.service.impl;

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

        if (!inventory.hasAvailableStock(request.getQuantity())) {
            throw new IllegalStateException("Insufficient stock for reservation");
        }

        // Update reserved stock
        inventory.setReservedStock(inventory.getReservedStock() + request.getQuantity());
        inventory.recalculateAvailableStock();
        inventoryRepository.save(inventory);

        // Create reservation
        int durationMinutes = request.getDurationMinutes() != null ? request.getDurationMinutes() : 15;
        StockReservation reservation = StockReservation.builder()
                .inventory(inventory)
                .cartId(request.getCartId())
                .userId(request.getUserId())
                .quantity(request.getQuantity())
                .expiresAt(LocalDateTime.now().plusMinutes(durationMinutes))
                .build();

        StockReservation saved = reservationRepository.save(reservation);
        log.info("Created reservation {} for variant {} qty {}", saved.getId(), request.getVariantId(),
                request.getQuantity());

        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void confirmReservation(Long reservationId) {
        StockReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Reservation is not pending: " + reservation.getStatus());
        }

        Inventory inventory = inventoryHelper
                .findByVariantIdForUpdateOrThrow(reservation.getInventory().getVariantId());
        int previousStock = inventory.getTotalStock();

        // Convert reservation to actual sale
        inventory.setTotalStock(inventory.getTotalStock() - reservation.getQuantity());
        inventory.setReservedStock(inventory.getReservedStock() - reservation.getQuantity());
        inventory.recalculateAvailableStock();

        transactionHelper.recordTransaction(inventory, TransactionType.SALE, -reservation.getQuantity(),
                previousStock, inventory.getTotalStock(), "ORDER",
                reservation.getCartId().toString(), "Reservation confirmed", reservation.getUserId());

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

        // Release reserved stock
        inventory.setReservedStock(Math.max(0, inventory.getReservedStock() - reservation.getQuantity()));
        inventory.recalculateAvailableStock();
        inventoryRepository.save(inventory);

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

                inventory.setReservedStock(Math.max(0, inventory.getReservedStock() - reservation.getQuantity()));
                inventory.recalculateAvailableStock();
                inventoryRepository.save(inventory);

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
}
