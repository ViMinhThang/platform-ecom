package com.ecom.order.helper;

import com.ecom.order.dto.ApplyVouchersRequest;
import com.ecom.order.dto.DiscountResultDTO;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DiscountHelper {

    public ApplyVouchersRequest buildApplyVouchersRequest(Long orderId, Cart cart, BigDecimal shippingFee,
            String voucherCode, Long userId) {
        List<ApplyVouchersRequest.CartItemForDiscount> items = cart.getItems().stream()
                .map(this::toCartItemForDiscount)
                .toList();

        return ApplyVouchersRequest.builder()
                .orderId(orderId)
                .items(items)
                .shippingFee(shippingFee)
                .voucherCode(voucherCode)
                .userId(userId)
                .build();
    }

    private ApplyVouchersRequest.CartItemForDiscount toCartItemForDiscount(CartItem item) {
        return ApplyVouchersRequest.CartItemForDiscount.builder()
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .build();
    }

    public DiscountResultDTO createZeroDiscount(Cart cart, BigDecimal shippingFee) {
        BigDecimal itemsTotal = cart.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DiscountResultDTO.builder()
                .originalTotal(itemsTotal.add(shippingFee))
                .productDiscount(BigDecimal.ZERO)
                .shippingDiscount(BigDecimal.ZERO)
                .totalDiscount(BigDecimal.ZERO)
                .finalTotal(itemsTotal.add(shippingFee))
                .build();
    }
}
