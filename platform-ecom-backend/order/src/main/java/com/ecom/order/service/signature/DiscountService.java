package com.ecom.order.service.signature;

import com.ecom.order.dto.DiscountResultDTO;
import com.ecom.order.entity.Cart;

import java.math.BigDecimal;

/**
 * Service for handling discount calculation and application
 */
public interface DiscountService {

    /**
     * Calculate discount preview for cart
     */
    DiscountResultDTO calculateDiscount(Cart cart, BigDecimal shippingFee, String voucherCode, Long userId);

    /**
     * Apply vouchers during checkout and record usage
     */
    DiscountResultDTO applyVouchers(Long orderId, Cart cart, BigDecimal shippingFee, String voucherCode, Long userId);
}
