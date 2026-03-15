package com.ecom.inventory.service.impl;

import com.ecom.inventory.dto.*;
import com.ecom.inventory.entity.*;
import com.ecom.inventory.helper.InventoryHelper;
import com.ecom.inventory.helper.InventoryTransactionHelper;
import com.ecom.inventory.mapper.InventoryMapper;
import com.ecom.inventory.repository.InventoryRepository;
import com.ecom.inventory.repository.InventoryTransactionRepository;
import com.ecom.inventory.repository.StockReservationRepository;
import com.ecom.inventory.service.InventoryService;
import com.ecom.inventory.service.signature.StockReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final InventoryHelper inventoryHelper;
    private final InventoryTransactionHelper transactionHelper;
    private final StockReservationService reservationService;

    // ==================== Query Operations ====================

    @Override
    @Transactional(readOnly = true)
    public InventoryDTO getByVariantId(Long variantId) {
        return mapper.toDTO(inventoryHelper.findByVariantIdOrThrow(variantId));
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
    public Page<InventoryDTO> getInventoryBySeller(List<Long> productIds, Pageable pageable) {
        if (productIds == null || productIds.isEmpty()) {
            return Page.empty(pageable);
        }
        return inventoryRepository.findByProductIdIn(productIds, pageable).map(mapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryDTO> getLowStockItemsBySeller(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }
        return inventoryRepository.findLowStockItemsByProductIds(productIds).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryTransactionDTO> getTransactionHistory(Long variantId, Pageable pageable) {
        Inventory inventory = inventoryHelper.findByVariantIdOrThrow(variantId);
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
        variantQuantities.forEach((id, qty) -> result.put(id, checkStock(id, qty)));
        return result;
    }

    @Override
    @Transactional
    public InventoryDTO adjustStock(Long variantId, StockAdjustmentRequest request, Long performedBy) {
        Inventory inventory = inventoryHelper.findByVariantIdForUpdateOrThrow(variantId);
        int previousStock = inventory.getTotalStock();
        int newStock = previousStock + request.getAdjustment();

        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative. Current: " + previousStock);
        }

        inventory.setTotalStock(newStock);
        inventory.recalculateAvailableStock();

        transactionHelper.recordTransaction(inventory, TransactionType.ADJUSTMENT, request.getAdjustment(),
                previousStock, newStock, request.getReferenceType(),
                request.getReferenceId(), request.getReason(), performedBy);

        Inventory saved = inventoryRepository.save(inventory);
        transactionHelper.publishStockUpdatedEvent(saved, previousStock, TransactionType.ADJUSTMENT,
                request.getReason(), performedBy);
        transactionHelper.checkAndAlert(saved);

        log.info("Adjusted stock for variant {}: {} -> {}", variantId, previousStock, newStock);
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InventoryDTO setStock(Long variantId, int newQuantity, String reason, Long performedBy) {
        Inventory inventory = inventoryHelper.findByVariantIdForUpdateOrThrow(variantId);
        int previousStock = inventory.getTotalStock();
        int adjustment = newQuantity - previousStock;

        inventory.setTotalStock(newQuantity);
        inventory.recalculateAvailableStock();

        transactionHelper.recordTransaction(inventory, TransactionType.ADJUSTMENT, adjustment,
                previousStock, newQuantity, "MANUAL", null, reason, performedBy);

        Inventory saved = inventoryRepository.save(inventory);
        transactionHelper.publishStockUpdatedEvent(saved, previousStock, TransactionType.ADJUSTMENT, reason,
                performedBy);
        transactionHelper.checkAndAlert(saved);

        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InventoryDTO updateSettings(Long variantId, InventorySettingsRequest request) {
        Inventory inventory = inventoryHelper.findByVariantIdOrThrow(variantId);

        if (request.getLowStockThreshold() != null)
            inventory.setLowStockThreshold(request.getLowStockThreshold());
        if (request.getReorderPoint() != null)
            inventory.setReorderPoint(request.getReorderPoint());
        if (request.getReorderQuantity() != null)
            inventory.setReorderQuantity(request.getReorderQuantity());
        if (request.getTrackInventory() != null)
            inventory.setTrackInventory(request.getTrackInventory());

        return mapper.toDTO(inventoryRepository.save(inventory));
    }

    // ==================== Reservations ====================

    @Override
    @Transactional
    public StockReservationDTO reserve(ReservationRequest request) {
        return reservationService.reserve(request);
    }

    @Override
    @Transactional
    public void confirmReservation(Long reservationId) {
        reservationService.confirmReservation(reservationId);
    }

    @Override
    @Transactional
    public void cancelReservation(Long reservationId) {
        reservationService.cancelReservation(reservationId);
    }

    @Override
    @Transactional
    public void expireStaleReservations() {
        reservationService.expireStaleReservations();
    }

    // ==================== Order Processing ====================

    @Override
    @Transactional
    public void processOrderCreated(Long variantId, int quantity, String orderNumber) {
        Inventory inventory = inventoryHelper.findByVariantIdForUpdateOrThrow(variantId);
        int previousStock = inventory.getTotalStock();
        int newStock = Math.max(0, previousStock - quantity);

        inventory.setTotalStock(newStock);
        inventory.recalculateAvailableStock();

        transactionHelper.recordTransaction(inventory, TransactionType.SALE, -quantity,
                previousStock, newStock, "ORDER", orderNumber,
                "Order " + orderNumber, null);

        Inventory saved = inventoryRepository.save(inventory);
        transactionHelper.publishStockUpdatedEvent(saved, previousStock, TransactionType.SALE, "Order " + orderNumber,
                null);
        transactionHelper.checkAndAlert(saved);

        log.info("Processed order {} for variant {}: {} -> {}", orderNumber, variantId, previousStock, newStock);
    }

    // ==================== Inventory Creation ====================

    @Override
    @Transactional
    public InventoryDTO createInventory(Long productId, Long variantId, String sku, int initialStock) {
        if (inventoryHelper.existsByVariantId(variantId)) {
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
            transactionHelper.recordTransaction(saved, TransactionType.INITIAL, initialStock,
                    0, initialStock, "MIGRATION", null,
                    "Initial stock from migration", null);
        }

        log.info("Created inventory for variant {} with stock {}", variantId, initialStock);
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteInventory(Long variantId) {
        Inventory inventory = inventoryHelper.findByVariantIdOrThrow(variantId);

        transactionRepository.deleteByInventoryId(inventory.getId());
        reservationRepository.deleteByInventoryId(inventory.getId());
        inventoryRepository.delete(inventory);

        log.info("Deleted inventory for variant {}", variantId);
    }
}
