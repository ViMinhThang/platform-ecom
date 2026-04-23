package com.ecom.inventory.controller;

import com.ecom.common.exception.APIException;
import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.inventory.client.ProductServiceClient;
import com.ecom.inventory.dto.InventoryDTO;
import com.ecom.inventory.dto.StockAdjustmentRequest;
import com.ecom.inventory.service.InventoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

/**
 * Seller endpoints for managing their own inventory.
 */
@Slf4j
@RestController
@Validated
@RequestMapping("/api/v1/sellers/inventory")
@RequiredArgsConstructor
public class SellerInventoryController {

    private final InventoryService inventoryService;
    private final AuthContext authContext;
    private final ProductServiceClient productServiceClient;

    /**
     * Get all inventory items for the seller's products with pagination
     */
    @GetMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<Page<InventoryDTO>>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "variantId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder,
            HttpServletRequest request) {

        Long sellerId = authContext.getUserId(request);
        List<Long> productIds = getProductIdsBySeller(sellerId);

        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<InventoryDTO> inventory = inventoryService.getInventoryBySeller(productIds, pageable);
        return ResponseBuilder.success("Inventory retrieved successfully", inventory);
    }

    /**
     * Get inventory for seller's variant
     */
    @GetMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<InventoryDTO>> getByVariantId(
            @PathVariable Long variantId,
            HttpServletRequest request) {
        Long sellerId = authContext.getUserId(request);
        InventoryDTO inventory = authorizeSellerVariantAccess(sellerId, variantId);
        return ResponseBuilder.success("Inventory retrieved successfully", inventory);
    }

    /**
     * Update stock for seller's variant
     */
    @PutMapping({"/{variantId}/stock", "/{variantId}/adjust"})
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<InventoryDTO>> updateStock(
            @PathVariable Long variantId,
            @Valid @RequestBody StockAdjustmentRequest requestAdjustment,
            HttpServletRequest request) {
        Long sellerId = authContext.getUserId(request);
        authorizeSellerVariantAccess(sellerId, variantId);
        InventoryDTO inventory = inventoryService.adjustStock(variantId, requestAdjustment, sellerId);
        return ResponseBuilder.success("Stock updated successfully", inventory);
    }

    /**
     * Get low stock items for seller
     */
    @GetMapping("/low-stock")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<List<InventoryDTO>>> getLowStockItems(HttpServletRequest request) {
        Long sellerId = authContext.getUserId(request);
        List<Long> productIds = getProductIdsBySeller(sellerId);
        List<InventoryDTO> lowStock = inventoryService.getLowStockItemsBySeller(productIds);
        return ResponseBuilder.success("Low stock items retrieved successfully", lowStock);
    }

    /**
     * Get product IDs by seller from internal product service
     */
    private List<Long> getProductIdsBySeller(Long sellerId) {
        try {
            var response = productServiceClient.getProductIdsBySellerId(sellerId);
            if (response.getBody() != null && response.getBody().getData() != null) {
                return response.getBody().getData();
            }
        } catch (Exception e) {
            log.error("Error fetching product IDs for seller: {}", sellerId, e);
        }
        return Collections.emptyList();
    }

    @GetMapping("/{variantId}/transactions")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<Page<com.ecom.inventory.dto.InventoryTransactionDTO>>> getTransactionHistory(
            @PathVariable Long variantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        Long sellerId = authContext.getUserId(request);
        authorizeSellerVariantAccess(sellerId, variantId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<com.ecom.inventory.dto.InventoryTransactionDTO> transactions = inventoryService
                .getTransactionHistory(variantId, pageable);
        return ResponseBuilder.success("Transaction history retrieved successfully", transactions);
    }

    @PutMapping("/{variantId}/settings")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<InventoryDTO>> updateSettings(
            @PathVariable Long variantId,
            @Valid @RequestBody com.ecom.inventory.dto.InventorySettingsRequest request,
            HttpServletRequest servletRequest) {
        Long sellerId = authContext.getUserId(servletRequest);
        authorizeSellerVariantAccess(sellerId, variantId);
        InventoryDTO inventory = inventoryService.updateSettings(variantId, request);
        return ResponseBuilder.success("Inventory settings updated successfully", inventory);
    }

    @PostMapping
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<InventoryDTO>> createInventory(
            @RequestParam Long productId,
            @RequestParam Long variantId,
            @RequestParam(required = false) String sku,
            @RequestParam(defaultValue = "0") @Min(value = 0, message = "Initial stock cannot be negative") int initialStock,
            HttpServletRequest request) {
        Long sellerId = authContext.getUserId(request);
        authorizeSellerCreateAccess(sellerId, productId, variantId);
        InventoryDTO inventory = inventoryService.createInventory(productId, variantId, sku, initialStock);
        return ResponseBuilder.createdWithMessage("Inventory created successfully", inventory);
    }

    @DeleteMapping("/{variantId}")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<Void>> deleteInventory(
            @PathVariable Long variantId,
            HttpServletRequest request) {
        Long sellerId = authContext.getUserId(request);
        authorizeSellerVariantAccess(sellerId, variantId);
        inventoryService.deleteInventory(variantId);
        return ResponseBuilder.noContent();
    }

    private InventoryDTO authorizeSellerVariantAccess(Long sellerId, Long variantId) {
        InventoryDTO inventory = inventoryService.getByVariantId(variantId);
        List<Long> productIds = getProductIdsBySeller(sellerId);
        if (!productIds.contains(inventory.getProductId())) {
            throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to access this inventory item");
        }
        return inventory;
    }

    private void authorizeSellerCreateAccess(Long sellerId, Long productId, Long variantId) {
        List<Long> productIds = getProductIdsBySeller(sellerId);
        if (!productIds.contains(productId)) {
            throw new APIException(HttpStatus.FORBIDDEN, "You are not allowed to create inventory for this product");
        }

        try {
            var response = productServiceClient.variantBelongsToProduct(productId, variantId);
            boolean variantMatchesProduct = response.getBody() != null
                    && response.getBody().getData() != null
                    && response.getBody().getData();
            if (!variantMatchesProduct) {
                throw new APIException(HttpStatus.BAD_REQUEST, "Variant does not belong to the specified product");
            }
        } catch (APIException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error validating product {} and variant {} for seller {}", productId, variantId, sellerId, e);
            throw new APIException(HttpStatus.BAD_GATEWAY, "Unable to validate product and variant ownership");
        }
    }
}
