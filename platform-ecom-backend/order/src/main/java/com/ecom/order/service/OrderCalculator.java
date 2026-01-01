package com.ecom.order.service;

import com.ecom.order.config.OrderConfigurationProperties;
import com.ecom.order.entity.Cart;
import com.ecom.order.entity.CartItem;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderCalculator {

    private final OrderConfigurationProperties properties;

    public BigDecimal calculateGrandTotal(Cart cart, BigDecimal shippingFee) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(properties.getTaxRate());
        return subtotal.add(shippingFee).add(tax);
    }

    public BigDecimal calculateSubOrderTotal(List<CartItem> items) {
        return items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void setSubOrderFinancials(SubOrder subOrder, BigDecimal subtotal, BigDecimal shippingFee) {
        BigDecimal tax = subtotal.add(shippingFee).multiply(properties.getTaxRate());

        subOrder.setSubtotal(subtotal);
        subOrder.setShippingCost(shippingFee);
        subOrder.setTax(tax);
        subOrder.setTotal(subtotal.add(shippingFee).add(tax));
    }
}
