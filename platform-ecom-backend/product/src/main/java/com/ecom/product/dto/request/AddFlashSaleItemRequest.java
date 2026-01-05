package com.ecom.product.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddFlashSaleItemRequest {

    @NotNull(message = "Variant ID is required")
    private Long variantId;

    @NotNull(message = "Flash sale price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal flashSalePrice;

    @NotNull(message = "Stock limit is required")
    @Positive(message = "Stock limit must be positive")
    private Integer stockLimit;

    private Integer sortOrder;
}
