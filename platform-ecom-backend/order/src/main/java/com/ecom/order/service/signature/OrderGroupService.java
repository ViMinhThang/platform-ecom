package com.ecom.order.service.signature;

import com.ecom.order.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Order Group Service Interface
 * Handles checkout initiation, payment confirmation, and order management
 */
public interface OrderGroupService {

    /**
     * Step 1: Initiate checkout - validates cart and creates Stripe PaymentIntent
     * No order is created at this step
     */
    CheckoutSessionDTO initiateCheckout(Long userId, CreateOrderRequest request);

    /**
     * Step 2: After Stripe payment succeeds, confirm and create the order
     * This is the only way orders are created - guaranteeing PAID status
     */
    OrderGroupDTO confirmPaymentAndCreateOrder(Long userId, ConfirmPaymentRequest request);

    OrderGroupDTO getOrderGroup(Long groupId, Long userId);

    Page<OrderGroupDTO> getUserOrderGroups(Long userId, Pageable pageable);

    void cancelOrderGroup(Long groupId, Long userId);

    // Admin methods
    Page<AdminOrderGroupDTO> getAllOrdersAdmin(OrderFilterRequest filter);

    AdminOrderGroupDTO getOrderDetailsAdmin(Long groupId);

    AdminOrderGroupDTO updateOrderStatus(Long groupId, String newStatus, String notes);

    AdminSubOrderDTO updateSubOrderStatus(Long groupId, Long subOrderId, String newStatus, Long adminId, String notes);

    AdminSubOrderDTO updateSubOrderTracking(Long groupId, Long subOrderId, TrackingUpdateRequest request);
}
