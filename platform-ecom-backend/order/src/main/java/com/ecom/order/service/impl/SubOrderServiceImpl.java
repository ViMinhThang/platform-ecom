package com.ecom.order.service.impl;

import com.ecom.common.exception.SubOrderNotFoundException;
import com.ecom.common.exception.UnauthorizedException;
import com.ecom.order.dto.SubOrderDTO;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.repository.SubOrderRepository;
import com.ecom.order.service.signature.SubOrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubOrderServiceImpl implements SubOrderService {

    private final SubOrderRepository subOrderRepository;
    private final ModelMapper modelMapper;

    /**
     * Get sub-order details
     */
    @Transactional(readOnly = true)
    public SubOrderDTO getSubOrder(Long subOrderId, Long userId) {
        SubOrder subOrder = subOrderRepository.findByIdWithItems(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));

        // Verify access: either the buyer or the seller
        if (!subOrder.getOrderGroup().getUserId().equals(userId) &&
                !subOrder.getSellerId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to view this sub-order");
        }

        return convertToDTO(subOrder);
    }

    /**
     * Get seller's sub-orders
     */
    @Transactional(readOnly = true)
    public Page<SubOrderDTO> getSellerSubOrders(Long sellerId, String status, Pageable pageable) {
        Page<SubOrder> subOrders;

        if (status != null && !status.isEmpty()) {
            SubOrderStatus subOrderStatus = SubOrderStatus.valueOf(status.toUpperCase());
            java.util.List<SubOrder> filteredList = subOrderRepository
                    .findBySellerIdAndStatus(sellerId, subOrderStatus);

            // Convert list to page
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), filteredList.size());

            subOrders = new org.springframework.data.domain.PageImpl<>(
                    filteredList.subList(start, end),
                    pageable,
                    filteredList.size());
        } else {
            subOrders = subOrderRepository.findBySellerId(sellerId, pageable);
        }

        return subOrders.map(this::convertToDTO);
    }

    /**
     * Update tracking information
     */
    @Transactional
    public SubOrderDTO updateTracking(Long subOrderId, Long sellerId,
            String trackingNumber, String carrier, String trackingUrl) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));

        // Verify seller ownership
        if (!subOrder.getSellerId().equals(sellerId)) {
            throw new UnauthorizedException("Not authorized to update this sub-order");
        }

        subOrder.setTrackingNumber(trackingNumber);
        subOrder.setCarrier(carrier);
        subOrder.setTrackingUrl(trackingUrl);

        subOrder = subOrderRepository.save(subOrder);

        log.info("Updated tracking for sub-order {}: {}", subOrderId, trackingNumber);

        return convertToDTO(subOrder);
    }

    /**
     * Mark sub-order as shipped
     */
    @Transactional
    public SubOrderDTO markAsShipped(Long subOrderId, Long sellerId) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));

        // Verify seller ownership
        if (!subOrder.getSellerId().equals(sellerId)) {
            throw new UnauthorizedException("Not authorized");
        }

        // Validate state
        if (subOrder.getStatus() != SubOrderStatus.PROCESSING) {
            throw new IllegalStateException("Can only ship orders in PROCESSING status");
        }

        // Require tracking number
        if (subOrder.getTrackingNumber() == null || subOrder.getTrackingNumber().isEmpty()) {
            throw new IllegalStateException("Tracking number required before shipping");
        }

        subOrder.updateStatus(SubOrderStatus.SHIPPED, sellerId, "Order shipped");
        subOrder.setShippedAt(LocalDateTime.now());

        subOrder = subOrderRepository.save(subOrder);

        log.info("Sub-order {} marked as shipped", subOrderId);

        return convertToDTO(subOrder);
    }

    /**
     * Mark sub-order as delivered
     */
    @Transactional
    public SubOrderDTO markAsDelivered(Long subOrderId, Long sellerId) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));

        // Verify seller ownership
        if (!subOrder.getSellerId().equals(sellerId)) {
            throw new UnauthorizedException("Not authorized");
        }

        // Validate state
        if (subOrder.getStatus() != SubOrderStatus.SHIPPED) {
            throw new IllegalStateException("Can only deliver shipped orders");
        }

        subOrder.updateStatus(SubOrderStatus.DELIVERED, sellerId, "Order delivered");
        subOrder.setDeliveredAt(LocalDateTime.now());

        subOrder = subOrderRepository.save(subOrder);

        log.info("Sub-order {} marked as delivered", subOrderId);

        return convertToDTO(subOrder);
    }

    /**
     * Cancel sub-order
     */
    @Transactional
    public void cancelSubOrder(Long subOrderId, Long userId, String reason) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));

        // Verify access
        boolean isBuyer = subOrder.getOrderGroup().getUserId().equals(userId);
        boolean isSeller = subOrder.getSellerId().equals(userId);

        if (!isBuyer && !isSeller) {
            throw new UnauthorizedException("Not authorized");
        }

        // Buyers can only cancel before shipping
        if (isBuyer && subOrder.getStatus() != SubOrderStatus.PENDING &&
                subOrder.getStatus() != SubOrderStatus.PROCESSING) {
            throw new IllegalStateException("Cannot cancel order after shipping");
        }

        subOrder.updateStatus(SubOrderStatus.CANCELLED, userId, reason);
        subOrder.setCancelledAt(LocalDateTime.now());

        subOrderRepository.save(subOrder);

        log.info("Sub-order {} cancelled by user {}", subOrderId, userId);
    }

    /**
     * Convert to DTO
     */
    private SubOrderDTO convertToDTO(SubOrder subOrder) {
        return modelMapper.map(subOrder, SubOrderDTO.class);
    }
}
