package com.ecom.order.service.impl;

import com.ecom.order.client.PromotionServiceClient;
import com.ecom.order.dto.ApplyVouchersRequest;
import com.ecom.order.dto.DiscountResultDTO;
import com.ecom.order.helper.DiscountHelper;
import com.ecom.order.entity.Cart;
import com.ecom.order.service.signature.DiscountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {

    private final PromotionServiceClient promotionServiceClient;
    private final DiscountHelper discountHelper;

    @Override
    public DiscountResultDTO calculateDiscount(Cart cart, BigDecimal shippingFee, String voucherCode, Long userId) {
        ApplyVouchersRequest request = discountHelper.buildApplyVouchersRequest(null, cart, shippingFee, voucherCode,
                userId);
        DiscountResultDTO result = promotionServiceClient.calculateDiscountSafe(request);

        if (result == null) {
            log.warn("Failed to calculate discount, returning zero discount");
            return discountHelper.createZeroDiscount(cart, shippingFee);
        }

        return result;
    }

    @Override
    public DiscountResultDTO applyVouchers(Long orderId, Cart cart, BigDecimal shippingFee, String voucherCode,
            Long userId) {
        ApplyVouchersRequest request = discountHelper.buildApplyVouchersRequest(orderId, cart, shippingFee, voucherCode,
                userId);
        DiscountResultDTO result = promotionServiceClient.applyVouchersSafe(request);

        if (result == null) {
            log.warn("Failed to apply vouchers for order {}, returning zero discount", orderId);
            return discountHelper.createZeroDiscount(cart, shippingFee);
        }

        log.info("Applied vouchers for order {}: productDiscount={}, shippingDiscount={}",
                orderId, result.getProductDiscount(), result.getShippingDiscount());

        return result;
    }
}
