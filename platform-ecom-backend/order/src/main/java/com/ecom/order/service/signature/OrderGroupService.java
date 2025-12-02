package com.ecom.order.service.signature;

import com.ecom.order.dto.CreateOrderRequest;
import com.ecom.order.dto.OrderGroupDTO;
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
}
