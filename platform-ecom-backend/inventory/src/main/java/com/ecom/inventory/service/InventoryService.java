package com.ecom.inventory.service;

import com.ecom.inventory.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Service interface for inventory management.
 */
public interface InventoryService {

    // ==================== Query Operations ====================

    /**
     * Get inventory by variant ID
     */
    InventoryDTO getByVariantId(Long variantId);

    /**
     * Get all inventory items with pagination
     */
    Page<InventoryDTO> getAllInventory(Pageable pageable);

    /**
     * Get low stock items
     */
    List<InventoryDTO> getLowStockItems();

    /**
     * Get transaction history for an inventory item
     */
    Page<InventoryTransactionDTO> getTransactionHistory(Long variantId, Pageable pageable);

    // ==================== Stock Management ====================

    /**
     * Check if stock is available
     */
    boolean checkStock(Long variantId, int quantity);

    /**
     * Bulk check stock availability
     */
    Map<Long, Boolean> checkStockBulk(Map<Long, Integer> variantQuantities);

    /**
     * Adjust stock (positive or negative)
     */
    InventoryDTO adjustStock(Long variantId, StockAdjustmentRequest request, Long performedBy);

    /**
     * Set stock to specific value
     */
    InventoryDTO setStock(Long variantId, int newQuantity, String reason, Long performedBy);

    /**
     * Update inventory settings
     */
    InventoryDTO updateSettings(Long variantId, InventorySettingsRequest request);

    // ==================== Reservations ====================

    /**
     * Reserve stock for checkout
     */
    StockReservationDTO reserve(ReservationRequest request);

    /**
     * Confirm reservation (converts to actual sale)
     */
    void confirmReservation(Long reservationId);

    /**
     * Cancel reservation (release stock)
     */
    void cancelReservation(Long reservationId);

    /**
     * Process expired reservations (scheduled task)
     */
    void expireStaleReservations();

    // ==================== Order Processing ====================

    /**
     * Process order created event - decrement stock
     */
    void processOrderCreated(Long variantId, int quantity, String orderNumber);

    // ==================== Inventory Creation ====================

    /**
     * Create inventory entry for a variant
     */
    InventoryDTO createInventory(Long productId, Long variantId, String sku, int initialStock);

    /**
     * Delete inventory entry for a variant
     */
    void deleteInventory(Long variantId);
}
