package com.ecom.promotion.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Request DTO for calculating discounts on cart items
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalculateDiscountRequest {
    private Long orderId; // Required for apply, null for calculate
    private java.util.List<CartItemDTO> items;
    private BigDecimal shippingFee;
    private String voucherCode; // Optional user-entered code
    private Long userId;
}
