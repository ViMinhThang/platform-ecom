package com.ecom.product.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class DiscountTierRequest {

    @NotNull(message = "Minimum price is required")
    @Positive(message = "Minimum price must be positive")
    private BigDecimal minPrice;

    @NotNull(message = "Maximum price is required")
    @Positive(message = "Maximum price must be positive")
    private BigDecimal maxPrice;

    @NotNull(message = "Discount percent is required")
    @Min(value = 1, message = "Discount must be at least 1%")
    @Max(value = 99, message = "Discount cannot exceed 99%")
    private Integer discountPercent;

    private Integer sortOrder;
}
