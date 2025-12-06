package com.ecom.inventory.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.inventory.dto.*;
import com.ecom.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin endpoints for inventory management.
 */
@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
public class AdminInventoryController {

    private final InventoryService inventoryService;

    /**
     * Get all inventory items with pagination
     */
    @GetMapping
    public ResponseEntity<APIResponse<Page<InventoryDTO>>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "variantId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {

        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<InventoryDTO> inventory = inventoryService.getAllInventory(pageable);
        return ResponseBuilder.success("Inventory retrieved successfully", inventory);
    }

    /**
     * Get inventory by variant ID
     */
    @GetMapping("/{variantId}")
    public ResponseEntity<APIResponse<InventoryDTO>> getByVariantId(@PathVariable Long variantId) {
        InventoryDTO inventory = inventoryService.getByVariantId(variantId);
        return ResponseBuilder.success("Inventory retrieved successfully", inventory);
    }

    /**
     * Get low stock items
     */
    @GetMapping("/low-stock")
    public ResponseEntity<APIResponse<List<InventoryDTO>>> getLowStockItems() {
        List<InventoryDTO> lowStock = inventoryService.getLowStockItems();
        return ResponseBuilder.success("Low stock items retrieved successfully", lowStock);
    }

    /**
     * Get transaction history for a variant
     */
    @GetMapping("/{variantId}/transactions")
    public ResponseEntity<APIResponse<Page<InventoryTransactionDTO>>> getTransactionHistory(
            @PathVariable Long variantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<InventoryTransactionDTO> transactions = inventoryService.getTransactionHistory(variantId, pageable);
        return ResponseBuilder.success("Transaction history retrieved successfully", transactions);
    }

    /**
     * Adjust stock (add or subtract)
     */
    @PutMapping("/{variantId}/adjust")
    public ResponseEntity<APIResponse<InventoryDTO>> adjustStock(
            @PathVariable Long variantId,
            @Valid @RequestBody StockAdjustmentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {

        InventoryDTO inventory = inventoryService.adjustStock(variantId, request, userId);
        return ResponseBuilder.success("Stock adjusted successfully", inventory);
    }

    /**
     * Update inventory settings
     */
    @PutMapping("/{variantId}/settings")
    public ResponseEntity<APIResponse<InventoryDTO>> updateSettings(
            @PathVariable Long variantId,
            @Valid @RequestBody InventorySettingsRequest request) {

        InventoryDTO inventory = inventoryService.updateSettings(variantId, request);
        return ResponseBuilder.success("Inventory settings updated successfully", inventory);
    }

    /**
     * Create inventory for a new variant
     */
    @PostMapping
    public ResponseEntity<APIResponse<InventoryDTO>> createInventory(
            @RequestParam Long productId,
            @RequestParam Long variantId,
            @RequestParam(required = false) String sku,
            @RequestParam(defaultValue = "0") int initialStock) {

        InventoryDTO inventory = inventoryService.createInventory(productId, variantId, sku, initialStock);
        return ResponseBuilder.created("Inventory created successfully", inventory);
    }
}
