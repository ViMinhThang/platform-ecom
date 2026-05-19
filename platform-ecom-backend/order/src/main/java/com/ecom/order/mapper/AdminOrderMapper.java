package com.ecom.order.mapper;

import com.ecom.order.dto.*;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AdminOrderMapper {

    public AdminOrderGroupDTO toAdminDTO(OrderGroup orderGroup, UserDTO user, AddressDTO shippingAddress,
            AddressDTO billingAddress) {
        if (orderGroup == null)
            return null;

        return AdminOrderGroupDTO.builder()
                .id(orderGroup.getId())
                .groupNumber(orderGroup.getGroupNumber())
                .userId(orderGroup.getUserId())
                .userEmail(user != null ? user.getEmail() : null)
                .userName(user != null ? user.getName() : null)
                .totalAmount(orderGroup.getTotalAmount())
                .taxAmount(orderGroup.getTaxAmount())
                .shippingCost(orderGroup.getShippingCost())
                .discountAmount(orderGroup.getDiscountAmount())
                .currency(orderGroup.getCurrency())
                .paymentStatus(orderGroup.getPaymentStatus().name())
                .overallStatus(orderGroup.getOverallStatus().name())
                .shippingAddress(shippingAddress)
                .billingAddress(billingAddress)
                .notes(orderGroup.getNotes())
                .createdAt(orderGroup.getCreatedAt())
                .updatedAt(orderGroup.getUpdatedAt())
                .subOrders(toAdminSubOrderDTOs(orderGroup.getSubOrders()))
                .paymentTransactions(new ArrayList<>())
                .build();
    }

    public List<AdminSubOrderDTO> toAdminSubOrderDTOs(List<SubOrder> subOrders) {
        if (subOrders == null)
            return new ArrayList<>();
        return subOrders.stream()
                .map(this::toAdminSubOrderDTO)
                .collect(Collectors.toList());
    }

    public AdminSubOrderDTO toAdminSubOrderDTO(SubOrder subOrder) {
        if (subOrder == null)
            return null;

        return AdminSubOrderDTO.builder()
                .id(subOrder.getId())
                .subOrderNumber(subOrder.getSubOrderNumber())
                .sellerId(subOrder.getSellerId())
                .sellerName(subOrder.getSellerName())
                .sellerEmail(null)
                .status(subOrder.getStatus().name())
                .fulfillmentStatus(subOrder.getFulfillmentStatus())
                .subtotal(subOrder.getSubtotal())
                .tax(subOrder.getTax())
                .shippingCost(subOrder.getShippingCost())
                .discount(subOrder.getDiscount())
                .total(subOrder.getTotal())
                .trackingNumber(subOrder.getTrackingNumber())
                .trackingUrl(subOrder.getTrackingUrl())
                .carrier(subOrder.getCarrier())
                .estimatedDelivery(subOrder.getEstimatedDelivery())
                .createdAt(subOrder.getCreatedAt())
                .updatedAt(subOrder.getUpdatedAt())
                .shippedAt(subOrder.getShippedAt())
                .deliveredAt(subOrder.getDeliveredAt())
                .cancelledAt(subOrder.getCancelledAt())
                .items(toSubOrderItemDTOs(subOrder.getItems()))
                .build();
    }

    public List<SubOrderItemDTO> toSubOrderItemDTOs(List<SubOrderItem> items) {
        if (items == null)
            return new ArrayList<>();
        return items.stream()
                .map(this::toSubOrderItemDTO)
                .collect(Collectors.toList());
    }

    public SubOrderItemDTO toSubOrderItemDTO(SubOrderItem item) {
        if (item == null)
            return null;

        return SubOrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .variantId(item.getVariantId())
                .variantName(item.getVariantName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
