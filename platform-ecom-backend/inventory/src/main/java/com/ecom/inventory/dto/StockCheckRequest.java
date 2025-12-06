package com.ecom.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request for bulk stock checks.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockCheckRequest {

    /**
     * Map of variantId -> requested quantity
     */
    @NotNull(message = "Items map is required")
    private Map<Long, Integer> items;
}
