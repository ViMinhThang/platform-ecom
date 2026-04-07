package com.ecom.order.service.signature;

import com.ecom.order.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderGroupService {

    CheckoutSessionDTO initiateCheckout(Long userId, CreateOrderRequest request);

    OrderGroupDTO confirmPaymentAndCreateOrder(Long userId, ConfirmPaymentRequest request);

    OrderGroupDTO getOrderGroup(Long groupId, Long userId);

    Page<OrderGroupDTO> getUserOrderGroups(Long userId, Pageable pageable);

    void cancelOrderGroup(Long groupId, Long userId);

    Page<AdminOrderGroupDTO> getAllOrdersAdmin(OrderFilterRequest filter);

    AdminOrderGroupDTO getOrderDetailsAdmin(Long groupId);

    AdminOrderGroupDTO updateOrderStatus(Long groupId, String newStatus, String notes);

    AdminSubOrderDTO updateSubOrderStatus(Long groupId, Long subOrderId, String newStatus, Long adminId, String notes);

    AdminSubOrderDTO updateSubOrderTracking(Long groupId, Long subOrderId, TrackingUpdateRequest request);

    boolean hasUserPurchasedProduct(String email, Long productId);
}
