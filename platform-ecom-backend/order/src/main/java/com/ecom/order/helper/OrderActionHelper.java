package com.ecom.order.helper;

import com.ecom.order.dto.TrackingUpdateRequest;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderActionHelper {

    public void cancelAllSubOrders(OrderGroup group, Long userId) {
        for (SubOrder subOrder : group.getSubOrders()) {
            subOrder.updateStatus(SubOrderStatus.CANCELLED, userId, "Order group cancelled");
        }
    }

    public void cancelActiveSubOrders(OrderGroup group, String notes) {
        for (SubOrder subOrder : group.getSubOrders()) {
            if (subOrder.getStatus() != SubOrderStatus.CANCELLED
                    && subOrder.getStatus() != SubOrderStatus.DELIVERED) {
                subOrder.updateStatus(SubOrderStatus.CANCELLED, null, "Admin cancelled: " + notes);
            }
        }
    }

    public void applyTrackingUpdates(SubOrder subOrder, TrackingUpdateRequest request) {
        if (request.getTrackingNumber() != null)
            subOrder.setTrackingNumber(request.getTrackingNumber());
        if (request.getTrackingUrl() != null)
            subOrder.setTrackingUrl(request.getTrackingUrl());
        if (request.getCarrier() != null)
            subOrder.setCarrier(request.getCarrier());
        if (request.getEstimatedDelivery() != null)
            subOrder.setEstimatedDelivery(request.getEstimatedDelivery());
        if (request.getFulfillmentStatus() != null)
            subOrder.setFulfillmentStatus(request.getFulfillmentStatus());
    }
}
