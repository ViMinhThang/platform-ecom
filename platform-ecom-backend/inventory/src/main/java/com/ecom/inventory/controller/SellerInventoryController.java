package com.ecom.inventory.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.inventory.dto.InventoryDTO;
import com.ecom.inventory.dto.StockAdjustmentRequest;
import com.ecom.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Seller endpoints for managing their own inventory.
 */
@RestController
@RequestMapping("/api/v1/sellers/inventory")
@RequiredArgsConstructor
public class SellerInventoryController {

    private final InventoryService inventoryService;

    /**
     * Get inventory for seller's variant
     */
    @GetMapping("/{variantId}")
    public ResponseEntity<APIResponse<InventoryDTO>> getByVariantId(
            @PathVariable Long variantId,
            @RequestHeader(value = "X-User-Id", required = false) Long sellerId) {
        // TODO: Add seller ownership validation
        InventoryDTO inventory = inventoryService.getByVariantId(variantId);
        return ResponseBuilder.success("Inventory retrieved successfully", inventory);
    }

    /**
     * Update stock for seller's variant
     */
    @PutMapping("/{variantId}/stock")
    public ResponseEntity<APIResponse<InventoryDTO>> updateStock(
            @PathVariable Long variantId,
            @Valid @RequestBody StockAdjustmentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long sellerId) {
        // TODO: Add seller ownership validation
        InventoryDTO inventory = inventoryService.adjustStock(variantId, request, sellerId);
        return ResponseBuilder.success("Stock updated successfully", inventory);
    }

    /**
     * Get low stock items for seller
     */
    @GetMapping("/low-stock")
    public ResponseEntity<APIResponse<List<InventoryDTO>>> getLowStockItems(
            @RequestHeader(value = "X-User-Id", required = false) Long sellerId) {
        // TODO: Filter by seller's products
        List<InventoryDTO> lowStock = inventoryService.getLowStockItems();
        return ResponseBuilder.success("Low stock items retrieved successfully", lowStock);
    }
}
