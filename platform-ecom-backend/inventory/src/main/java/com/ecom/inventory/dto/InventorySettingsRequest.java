package com.ecom.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for updating inventory settings.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventorySettingsRequest {
    private Integer lowStockThreshold;
    private Integer reorderPoint;
    private Integer reorderQuantity;
    private Boolean trackInventory;
}
