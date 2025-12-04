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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubOrderServiceImpl implements SubOrderService {

    private final SubOrderRepository subOrderRepository;
    private final ModelMapper modelMapper;

    // ==================== Public API ====================

    @Override
    @Transactional(readOnly = true)
    public SubOrderDTO getSubOrder(Long subOrderId, Long userId) {
        SubOrder subOrder = findSubOrderById(subOrderId);
        verifyBuyerOrSellerAccess(subOrder, userId);
        return convertToDTO(subOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubOrderDTO> getSellerSubOrders(Long sellerId, String status, Pageable pageable) {
        Page<SubOrder> subOrders = fetchSellerSubOrders(sellerId, status, pageable);
        return subOrders.map(this::convertToDTO);
    }

    @Override
    @Transactional
    public SubOrderDTO updateTracking(Long subOrderId, Long sellerId,
                                       String trackingNumber, String carrier, String trackingUrl) {
        SubOrder subOrder = findSubOrderById(subOrderId);
        verifySellerOwnership(subOrder, sellerId);

        subOrder.setTrackingNumber(trackingNumber);
        subOrder.setCarrier(carrier);
        subOrder.setTrackingUrl(trackingUrl);

        subOrder = subOrderRepository.save(subOrder);
        log.info("Updated tracking for sub-order {}: {}", subOrderId, trackingNumber);

        return convertToDTO(subOrder);
    }

    @Override
    @Transactional
    public SubOrderDTO markAsShipped(Long subOrderId, Long sellerId) {
        SubOrder subOrder = findSubOrderById(subOrderId);
        verifySellerOwnership(subOrder, sellerId);
        validateCanShip(subOrder);

        subOrder.updateStatus(SubOrderStatus.SHIPPED, sellerId, "Order shipped");
        subOrder.setShippedAt(LocalDateTime.now());

        subOrder = subOrderRepository.save(subOrder);
        log.info("Sub-order {} marked as shipped", subOrderId);

        return convertToDTO(subOrder);
    }

    @Override
    @Transactional
    public SubOrderDTO markAsDelivered(Long subOrderId, Long sellerId) {
        SubOrder subOrder = findSubOrderById(subOrderId);
        verifySellerOwnership(subOrder, sellerId);
        validateCanDeliver(subOrder);

        subOrder.updateStatus(SubOrderStatus.DELIVERED, sellerId, "Order delivered");
        subOrder.setDeliveredAt(LocalDateTime.now());

        subOrder = subOrderRepository.save(subOrder);
        log.info("Sub-order {} marked as delivered", subOrderId);

        return convertToDTO(subOrder);
    }

    @Override
    @Transactional
    public void cancelSubOrder(Long subOrderId, Long userId, String reason) {
        SubOrder subOrder = findSubOrderById(subOrderId);
        boolean isBuyer = isBuyer(subOrder, userId);
        boolean isSeller = isSeller(subOrder, userId);

        verifyBuyerOrSellerAccess(isBuyer, isSeller);
        validateBuyerCanCancel(subOrder, isBuyer);

        subOrder.updateStatus(SubOrderStatus.CANCELLED, userId, reason);
        subOrder.setCancelledAt(LocalDateTime.now());

        subOrderRepository.save(subOrder);
        log.info("Sub-order {} cancelled by user {}", subOrderId, userId);
    }

    // ==================== Private Helpers: Retrieval ====================

    private SubOrder findSubOrderById(Long subOrderId) {
        return subOrderRepository.findByIdWithItems(subOrderId)
                .orElseThrow(() -> new SubOrderNotFoundException(subOrderId));
    }

    private Page<SubOrder> fetchSellerSubOrders(Long sellerId, String status, Pageable pageable) {
        if (status == null || status.isEmpty()) {
            return subOrderRepository.findBySellerId(sellerId, pageable);
        }

        SubOrderStatus subOrderStatus = SubOrderStatus.valueOf(status.toUpperCase());
        List<SubOrder> filtered = subOrderRepository.findBySellerIdAndStatus(sellerId, subOrderStatus);

        return toPage(filtered, pageable);
    }

    private Page<SubOrder> toPage(List<SubOrder> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), list.size());
        return new PageImpl<>(list.subList(start, end), pageable, list.size());
    }

    // ==================== Private Helpers: Authorization ====================

    private boolean isBuyer(SubOrder subOrder, Long userId) {
        return subOrder.getOrderGroup().getUserId().equals(userId);
    }

    private boolean isSeller(SubOrder subOrder, Long userId) {
        return subOrder.getSellerId().equals(userId);
    }

    private void verifySellerOwnership(SubOrder subOrder, Long sellerId) {
        if (!isSeller(subOrder, sellerId)) {
            throw new UnauthorizedException("Not authorized to modify this sub-order");
        }
    }

    private void verifyBuyerOrSellerAccess(SubOrder subOrder, Long userId) {
        if (!isBuyer(subOrder, userId) && !isSeller(subOrder, userId)) {
            throw new UnauthorizedException("Not authorized to view this sub-order");
        }
    }

    private void verifyBuyerOrSellerAccess(boolean isBuyer, boolean isSeller) {
        if (!isBuyer && !isSeller) {
            throw new UnauthorizedException("Not authorized");
        }
    }

    // ==================== Private Helpers: Validation ====================

    private void validateCanShip(SubOrder subOrder) {
        if (subOrder.getStatus() != SubOrderStatus.PROCESSING) {
            throw new IllegalStateException("Can only ship orders in PROCESSING status");
        }

        if (subOrder.getTrackingNumber() == null || subOrder.getTrackingNumber().isEmpty()) {
            throw new IllegalStateException("Tracking number required before shipping");
        }
    }

    private void validateCanDeliver(SubOrder subOrder) {
        if (subOrder.getStatus() != SubOrderStatus.SHIPPED) {
            throw new IllegalStateException("Can only deliver shipped orders");
        }
    }

    private void validateBuyerCanCancel(SubOrder subOrder, boolean isBuyer) {
        if (isBuyer && !isCancellableByBuyer(subOrder)) {
            throw new IllegalStateException("Cannot cancel order after shipping");
        }
    }

    private boolean isCancellableByBuyer(SubOrder subOrder) {
        return subOrder.getStatus() == SubOrderStatus.PENDING
                || subOrder.getStatus() == SubOrderStatus.PROCESSING;
    }

    // ==================== Private Helpers: Conversion ====================

    private SubOrderDTO convertToDTO(SubOrder subOrder) {
        return modelMapper.map(subOrder, SubOrderDTO.class);
    }
}
