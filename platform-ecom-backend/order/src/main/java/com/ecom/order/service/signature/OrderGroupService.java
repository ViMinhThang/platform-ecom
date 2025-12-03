package com.ecom.order.service.signature;

import com.ecom.order.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Order Group Service Interface
 */
public interface OrderGroupService {

    OrderGroupDTO createFromCart(Long userId, CreateOrderRequest request);

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
