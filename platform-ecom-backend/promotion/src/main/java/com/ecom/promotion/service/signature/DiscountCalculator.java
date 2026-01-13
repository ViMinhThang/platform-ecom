package com.ecom.promotion.service.signature;

import com.ecom.promotion.dto.CartItemDTO;
import com.ecom.promotion.dto.DiscountResult;

import java.math.BigDecimal;
import java.util.List;

/**
 * Calculates discounts with stacking rules:
 * - ONE product/category voucher + ONE shipping voucher = OK
 * - Cannot stack multiple product vouchers
 * - Cannot stack multiple shipping vouchers
 */
public interface DiscountCalculator {

    /**
     * Calculate best discounts for cart items (preview only)
     */
    DiscountResult calculateDiscount(
            List<CartItemDTO> items,
            BigDecimal shippingFee,
            String voucherCode,
            Long userId);

    /**
     * Apply vouchers at checkout and record usage
     */
    DiscountResult applyVouchers(
            Long orderId,
            List<CartItemDTO> items,
            BigDecimal shippingFee,
            String voucherCode,
            Long userId);
}
