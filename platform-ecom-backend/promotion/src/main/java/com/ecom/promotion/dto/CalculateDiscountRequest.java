package com.ecom.promotion.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request DTO for calculating discounts on cart items
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalculateDiscountRequest {
    private Long orderId; // Required for apply, null for calculate
    private List<CartItemDTO> items;
    private BigDecimal shippingFee;
    private List<String> voucherCodes; // Optional user-entered codes
    private Long userId;
}
