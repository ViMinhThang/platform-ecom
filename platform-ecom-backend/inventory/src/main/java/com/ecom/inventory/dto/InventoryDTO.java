package com.ecom.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for inventory information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {
    private Long id;
    private Long productId;
    private Long variantId;
    private String sku;
    private Integer availableStock;
    private Integer reservedStock;
    private Integer totalStock;
    private Integer lowStockThreshold;
    private Integer reorderPoint;
    private Integer reorderQuantity;
    private Boolean trackInventory;
    private Boolean isLowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
