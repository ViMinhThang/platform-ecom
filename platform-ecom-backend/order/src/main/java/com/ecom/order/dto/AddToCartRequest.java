package com.ecom.order.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be positive")
    private Long productId;

    @Positive(message = "Variant ID must be positive")
    private Long variantId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Max(value = 999, message = "Quantity cannot exceed 999")
    private Integer quantity;
}
