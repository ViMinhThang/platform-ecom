package com.ecom.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request for adjusting stock levels.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentRequest {

    @NotNull(message = "Adjustment quantity is required")
    private Integer adjustment;

    private String reason;

    private String referenceType;

    private String referenceId;
}
