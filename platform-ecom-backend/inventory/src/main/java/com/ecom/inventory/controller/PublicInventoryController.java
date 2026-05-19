package com.ecom.inventory.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.inventory.dto.InventoryDTO;
import com.ecom.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoints for inventory information.
 */
@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class PublicInventoryController {

    private final InventoryService inventoryService;

    /**
     * Get stock information for a variant (public)
     */
    @GetMapping("/variants/{variantId}")
    public ResponseEntity<APIResponse<InventoryDTO>> getByVariantId(@PathVariable Long variantId) {
        InventoryDTO inventory = inventoryService.getByVariantId(variantId);
        return ResponseBuilder.success("Inventory retrieved successfully", inventory);
    }

    /**
     * Check if stock is available
     */
    @GetMapping("/variants/{variantId}/check")
    public ResponseEntity<APIResponse<Boolean>> checkStock(
            @PathVariable Long variantId,
            @RequestParam int quantity) {
        boolean available = inventoryService.checkStock(variantId, quantity);
        return ResponseBuilder.success("Stock check completed", available);
    }
}
