package com.ecom.order.service.signature;

import com.ecom.order.dto.SubOrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Sub Order Service Interface
 */
public interface SubOrderService {

    SubOrderDTO getSubOrder(Long subOrderId, Long userId);

    Page<SubOrderDTO> getSellerSubOrders(Long sellerId, String status, Pageable pageable);

    SubOrderDTO updateTracking(Long subOrderId, Long sellerId, String trackingNumber, String carrier,
            String trackingUrl);

    SubOrderDTO markAsShipped(Long subOrderId, Long sellerId);

    SubOrderDTO markAsDelivered(Long subOrderId, Long sellerId);

    void cancelSubOrder(Long subOrderId, Long userId, String reason);
}
