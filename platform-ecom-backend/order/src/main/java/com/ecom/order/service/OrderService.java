package com.ecom.order.service;

import com.ecom.order.dtos.OrderDTO;
import com.ecom.order.dtos.OrderResponse;

public interface OrderService {
    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
            Long userId);

    OrderDTO updateOrder(Long orderId, String status);

    OrderDTO placeOrder(Long userId, Long addressId, String paymentMethod, String pgName, String pgPaymentId,
            String pgStatus, String pgResponseMessage);

    Long getOrdersCount();

    Double getTotalRevenue();

    OrderDTO getOrderById(Long orderId);

    Boolean verifyUserPurchase(String email, Long productId);

    // Get orders for a specific user (by email)
    OrderResponse getUserOrders(String email, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
