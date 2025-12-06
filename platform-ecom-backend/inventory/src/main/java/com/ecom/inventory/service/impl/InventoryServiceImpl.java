package com.ecom.inventory.service.impl;

import com.ecom.common.event.LowStockAlertEvent;
import com.ecom.common.event.StockUpdatedEvent;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.inventory.dto.*;
import com.ecom.inventory.entity.*;
import com.ecom.inventory.event.InventoryEventPublisher;
import com.ecom.inventory.mapper.InventoryMapper;
import com.ecom.inventory.repository.InventoryRepository;
import com.ecom.inventory.repository.InventoryTransactionRepository;
import com.ecom.inventory.repository.StockReservationRepository;
import com.ecom.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final StockReservationRepository reservationRepository;
    private final InventoryMapper mapper;
    private final InventoryEventPublisher eventPublisher;

    // ==================== Query Operations ====================

    @Override
    @Transactional(readOnly = true)
    public InventoryDTO getByVariantId(Long variantId) {
        Inventory inventory = findByVariantIdOrThrow(variantId);
        return mapper.toDTO(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryDTO> getAllInventory(Pageable pageable) {
        return inventoryRepository.findAll(pageable).map(mapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryDTO> getLowStockItems() {
        return inventoryRepository.findLowStockItems().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryTransactionDTO> getTransactionHistory(Long variantId, Pageable pageable) {
        Inventory inventory = findByVariantIdOrThrow(variantId);
        return transactionRepository.findByInventoryId(inventory.getId(), pageable)
                .map(mapper::toDTO);
    }

    // ==================== Stock Management ====================

    @Override
    @Transactional(readOnly = true)
    public boolean checkStock(Long variantId, int quantity) {
        return inventoryRepository.findByVariantId(variantId)
                .map(inv -> inv.hasAvailableStock(quantity))
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, Boolean> checkStockBulk(Map<Long, Integer> variantQuantities) {
        Map<Long, Boolean> result = new HashMap<>();
        for (Map.Entry<Long, Integer> entry : variantQuantities.entrySet()) {
            result.put(entry.getKey(), checkStock(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    @Override
    @Transactional
    public InventoryDTO adjustStock(Long variantId, StockAdjustmentRequest request, Long performedBy) {
        Inventory inventory = findByVariantIdForUpdate(variantId);
        int previousStock = inventory.getTotalStock();
        int newStock = previousStock + request.getAdjustment();

        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative. Current: " + previousStock);
        }

        inventory.setTotalStock(newStock);
        inventory.recalculateAvailableStock();

        recordTransaction(inventory, TransactionType.ADJUSTMENT, request.getAdjustment(),
                previousStock, newStock, request.getReferenceType(),
                request.getReferenceId(), request.getReason(), performedBy);

        Inventory saved = inventoryRepository.save(inventory);
        publishStockUpdatedEvent(saved, previousStock, TransactionType.ADJUSTMENT, request.getReason(), performedBy);
        checkAndAlertLowStock(saved);

        log.info("Adjusted stock for variant {}: {} -> {}", variantId, previousStock, newStock);
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InventoryDTO setStock(Long variantId, int newQuantity, String reason, Long performedBy) {
        Inventory inventory = findByVariantIdForUpdate(variantId);
        int previousStock = inventory.getTotalStock();
        int adjustment = newQuantity - previousStock;

        inventory.setTotalStock(newQuantity);
        inventory.recalculateAvailableStock();

        recordTransaction(inventory, TransactionType.ADJUSTMENT, adjustment,
                previousStock, newQuantity, "MANUAL", null, reason, performedBy);

        Inventory saved = inventoryRepository.save(inventory);
        publishStockUpdatedEvent(saved, previousStock, TransactionType.ADJUSTMENT, reason, performedBy);
        checkAndAlertLowStock(saved);

        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InventoryDTO updateSettings(Long variantId, InventorySettingsRequest request) {
        Inventory inventory = findByVariantIdOrThrow(variantId);

        if (request.getLowStockThreshold() != null) {
            inventory.setLowStockThreshold(request.getLowStockThreshold());
        }
        if (request.getReorderPoint() != null) {
            inventory.setReorderPoint(request.getReorderPoint());
        }
        if (request.getReorderQuantity() != null) {
            inventory.setReorderQuantity(request.getReorderQuantity());
        }
        if (request.getTrackInventory() != null) {
            inventory.setTrackInventory(request.getTrackInventory());
        }

        return mapper.toDTO(inventoryRepository.save(inventory));
    }

    // ==================== Reservations ====================

    @Override
    @Transactional
    public StockReservationDTO reserve(ReservationRequest request) {
        Inventory inventory = findByVariantIdForUpdate(request.getVariantId());

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
        log.info("Created reservation {} for variant {} qty {}", saved.getId(), request.getVariantId(), request.getQuantity());

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

        Inventory inventory = findByVariantIdForUpdate(reservation.getInventory().getVariantId());
        int previousStock = inventory.getTotalStock();

        // Convert reservation to actual sale
        inventory.setTotalStock(inventory.getTotalStock() - reservation.getQuantity());
        inventory.setReservedStock(inventory.getReservedStock() - reservation.getQuantity());
        inventory.recalculateAvailableStock();

        recordTransaction(inventory, TransactionType.SALE, -reservation.getQuantity(),
                previousStock, inventory.getTotalStock(), "ORDER",
                reservation.getCartId().toString(), "Reservation confirmed", reservation.getUserId());

        inventoryRepository.save(inventory);
        reservation.confirm();
        reservationRepository.save(reservation);

        publishStockUpdatedEvent(inventory, previousStock, TransactionType.SALE, "Order confirmed", reservation.getUserId());
        checkAndAlertLowStock(inventory);

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

        Inventory inventory = findByVariantIdForUpdate(reservation.getInventory().getVariantId());

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
                Inventory inventory = findByVariantIdForUpdate(reservation.getInventory().getVariantId());

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

    // ==================== Order Processing ====================

    @Override
    @Transactional
    public void processOrderCreated(Long variantId, int quantity, String orderNumber) {
        Inventory inventory = findByVariantIdForUpdate(variantId);
        int previousStock = inventory.getTotalStock();
        int newStock = Math.max(0, previousStock - quantity);

        inventory.setTotalStock(newStock);
        inventory.recalculateAvailableStock();

        recordTransaction(inventory, TransactionType.SALE, -quantity,
                previousStock, newStock, "ORDER", orderNumber,
                "Order " + orderNumber, null);

        Inventory saved = inventoryRepository.save(inventory);
        publishStockUpdatedEvent(saved, previousStock, TransactionType.SALE, "Order " + orderNumber, null);
        checkAndAlertLowStock(saved);

        log.info("Processed order {} for variant {}: {} -> {}", orderNumber, variantId, previousStock, newStock);
    }

    // ==================== Inventory Creation ====================

    @Override
    @Transactional
    public InventoryDTO createInventory(Long productId, Long variantId, String sku, int initialStock) {
        if (inventoryRepository.existsByVariantId(variantId)) {
            throw new IllegalStateException("Inventory already exists for variant: " + variantId);
        }

        Inventory inventory = Inventory.builder()
                .productId(productId)
                .variantId(variantId)
                .sku(sku)
                .totalStock(initialStock)
                .availableStock(initialStock)
                .reservedStock(0)
                .build();

        Inventory saved = inventoryRepository.save(inventory);

        if (initialStock > 0) {
            recordTransaction(saved, TransactionType.INITIAL, initialStock,
                    0, initialStock, "MIGRATION", null,
                    "Initial stock from migration", null);
        }

        log.info("Created inventory for variant {} with stock {}", variantId, initialStock);
        return mapper.toDTO(saved);
    }

    // ==================== Private Helpers ====================

    private Inventory findByVariantIdOrThrow(Long variantId) {
        return inventoryRepository.findByVariantId(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "variantId", variantId));
    }

    private Inventory findByVariantIdForUpdate(Long variantId) {
        return inventoryRepository.findByVariantIdForUpdate(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "variantId", variantId));
    }

    private void recordTransaction(Inventory inventory, TransactionType type, int quantityChange,
                                   int stockBefore, int stockAfter, String referenceType,
                                   String referenceId, String reason, Long performedBy) {
        InventoryTransaction transaction = InventoryTransaction.builder()
                .inventory(inventory)
                .type(type)
                .quantityChange(quantityChange)
                .stockBefore(stockBefore)
                .stockAfter(stockAfter)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .reason(reason)
                .performedBy(performedBy)
                .build();

        transactionRepository.save(transaction);
    }

    private void publishStockUpdatedEvent(Inventory inventory, int previousStock,
                                          TransactionType type, String reason, Long performedBy) {
        StockUpdatedEvent event = StockUpdatedEvent.builder()
                .variantId(inventory.getVariantId())
                .productId(inventory.getProductId())
                .previousStock(previousStock)
                .newStock(inventory.getTotalStock())
                .reservedStock(inventory.getReservedStock())
                .transactionType(type.name())
                .reason(reason)
                .performedBy(performedBy)
                .timestamp(LocalDateTime.now())
                .build();

        eventPublisher.publishStockUpdated(event);
    }

    private void checkAndAlertLowStock(Inventory inventory) {
        if (inventory.isLowStock()) {
            LowStockAlertEvent alert = LowStockAlertEvent.builder()
                    .variantId(inventory.getVariantId())
                    .productId(inventory.getProductId())
                    .sku(inventory.getSku())
                    .currentStock(inventory.getAvailableStock())
                    .threshold(inventory.getLowStockThreshold())
                    .timestamp(LocalDateTime.now())
                    .build();

            eventPublisher.publishLowStockAlert(alert);
            log.warn("Low stock alert for variant {}: {} <= {}", 
                    inventory.getVariantId(), inventory.getAvailableStock(), inventory.getLowStockThreshold());
        }
    }
}
