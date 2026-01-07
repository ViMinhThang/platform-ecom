package com.ecom.order.helper;

import com.ecom.order.config.OrderConfigurationProperties;
import com.ecom.order.entity.*;
import com.ecom.order.service.OrderCalculator;
import com.ecom.order.service.OrderNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderCreationHelper {

    private final OrderConfigurationProperties properties;
    private final OrderCalculator orderCalculator;
    private final OrderNumberGenerator orderNumberGenerator;

    public Map<Long, List<CartItem>> groupItemsBySeller(Cart cart) {
        return cart.getItems().stream()
                .collect(Collectors.groupingBy(CartItem::getSellerId));
    }

    public OrderGroup buildOrderGroup(Long userId, Cart cart, Long addressId, BigDecimal shippingFee) {
        Map<Long, List<CartItem>> itemsBySeller = groupItemsBySeller(cart);

        int sellerCount = itemsBySeller.size();
        BigDecimal shippingPerSeller = shippingFee.divide(
                BigDecimal.valueOf(sellerCount), 2, RoundingMode.HALF_UP);

        OrderGroup group = OrderGroup.builder()
                .groupNumber(orderNumberGenerator.generateGroupNumber())
                .userId(userId)
                .overallStatus(OrderGroupStatus.PAID)
                .paymentStatus(PaymentStatus.SUCCEEDED)
                .shippingAddressId(addressId)
                .currency(properties.getDefaultCurrency())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            SubOrder subOrder = buildSubOrder(group, entry.getKey(), entry.getValue(), shippingPerSeller);
            group.addSubOrder(subOrder);
            totalAmount = totalAmount.add(subOrder.getTotal());
        }

        group.setTotalAmount(totalAmount);
        group.recalculateTotals();

        return group;
    }

    public SubOrder buildSubOrder(OrderGroup group, Long sellerId, List<CartItem> items, BigDecimal shippingFee) {
        String sellerName = items.get(0).getSellerName();

        SubOrder subOrder = SubOrder.builder()
                .subOrderNumber(orderNumberGenerator.generateSubOrderNumber(group.getGroupNumber(), sellerId))
                .orderGroup(group)
                .sellerId(sellerId)
                .sellerName(sellerName)
                .status(SubOrderStatus.PENDING)
                .build();

        BigDecimal subtotal = addItemsToSubOrder(subOrder, items);
        orderCalculator.setSubOrderFinancials(subOrder, subtotal, shippingFee);

        return subOrder;
    }

    public BigDecimal addItemsToSubOrder(SubOrder subOrder, List<CartItem> items) {
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : items) {
            SubOrderItem orderItem = SubOrderItem.builder()
                    .subOrder(subOrder)
                    .productId(cartItem.getProductId())
                    .variantId(cartItem.getVariantId())
                    .productName(cartItem.getProductName())
                    .variantName(cartItem.getVariantName())
                    .imageUrl(cartItem.getImageUrl())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getPrice())
                    .build();

            orderItem.calculateTotalPrice();
            subOrder.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }
        return subtotal;
    }
}
