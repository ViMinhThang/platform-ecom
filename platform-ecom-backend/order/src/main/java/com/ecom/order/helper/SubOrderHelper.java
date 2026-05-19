package com.ecom.order.helper;

import com.ecom.common.exception.SubOrderNotFoundException;
import com.ecom.common.exception.UnauthorizedException;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.repository.SubOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubOrderHelper {

    private final SubOrderRepository subOrderRepository;

    public SubOrder findByIdOrThrow(Long subOrderId) {
        return subOrderRepository.findByIdWithItems(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));
    }

    public void verifySellerOwnership(SubOrder subOrder, Long sellerId) {
        if (!subOrder.getSellerId().equals(sellerId)) {
            throw new UnauthorizedException("Not authorized to modify this sub-order");
        }
    }

    public void verifyBuyerOrSellerAccess(SubOrder subOrder, Long userId) {
        boolean isBuyer = subOrder.getOrderGroup().getUserId().equals(userId);
        boolean isSeller = subOrder.getSellerId().equals(userId);
        if (!isBuyer && !isSeller) {
            throw new UnauthorizedException("Not authorized to access this sub-order");
        }
    }

    public void validateCanShip(SubOrder subOrder) {
        if (subOrder.getStatus() != SubOrderStatus.PROCESSING) {
            throw new IllegalStateException("Can only ship orders in PROCESSING status");
        }

        if (subOrder.getTrackingNumber() == null || subOrder.getTrackingNumber().isEmpty()) {
            throw new IllegalStateException("Tracking number required before shipping");
        }
    }

    public void validateCanDeliver(SubOrder subOrder) {
        if (subOrder.getStatus() != SubOrderStatus.SHIPPED) {
            throw new IllegalStateException("Can only deliver shipped orders");
        }
    }

    public void validateBuyerCanCancel(SubOrder subOrder, Long userId) {
        if (subOrder.getOrderGroup().getUserId().equals(userId)) {
            if (subOrder.getStatus() != SubOrderStatus.PENDING && subOrder.getStatus() != SubOrderStatus.PROCESSING) {
                throw new IllegalStateException("Cannot cancel order after shipping");
            }
        }
    }
}
