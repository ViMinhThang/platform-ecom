package com.ecom.order.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request to calculate/apply vouchers at checkout
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyVouchersRequest {
    private Long orderId; // Required for apply, null for calculate
    private List<CartItemForDiscount> items;
    private BigDecimal shippingFee;
    private String voucherCode;
    private Long userId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemForDiscount {
        private Long productId;
        private Long variantId;
        private Long categoryId;
        private BigDecimal price;
        private Integer quantity;
    }
}
