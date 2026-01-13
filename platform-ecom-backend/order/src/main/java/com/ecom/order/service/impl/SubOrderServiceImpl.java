package com.ecom.order.service.impl;

import com.ecom.order.dto.SubOrderDTO;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.helper.SubOrderHelper;
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
    private final SubOrderHelper subOrderHelper;

    @Override
    @Transactional(readOnly = true)
    public SubOrderDTO getSubOrder(Long subOrderId, Long userId) {
        SubOrder subOrder = subOrderHelper.findByIdOrThrow(subOrderId);
        subOrderHelper.verifyBuyerOrSellerAccess(subOrder, userId);
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
        SubOrder subOrder = subOrderHelper.findByIdOrThrow(subOrderId);
        subOrderHelper.verifySellerOwnership(subOrder, sellerId);

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
        SubOrder subOrder = subOrderHelper.findByIdOrThrow(subOrderId);
        subOrderHelper.verifySellerOwnership(subOrder, sellerId);
        subOrderHelper.validateCanShip(subOrder);

        subOrder.updateStatus(SubOrderStatus.SHIPPED, sellerId, "Order shipped");
        subOrder.setShippedAt(LocalDateTime.now());

        subOrder = subOrderRepository.save(subOrder);
        log.info("Sub-order {} marked as shipped", subOrderId);

        return convertToDTO(subOrder);
    }

    @Override
    @Transactional
    public SubOrderDTO markAsDelivered(Long subOrderId, Long sellerId) {
        SubOrder subOrder = subOrderHelper.findByIdOrThrow(subOrderId);
        subOrderHelper.verifySellerOwnership(subOrder, sellerId);
        subOrderHelper.validateCanDeliver(subOrder);

        subOrder.updateStatus(SubOrderStatus.DELIVERED, sellerId, "Order delivered");
        subOrder.setDeliveredAt(LocalDateTime.now());

        subOrder = subOrderRepository.save(subOrder);
        log.info("Sub-order {} marked as delivered", subOrderId);

        return convertToDTO(subOrder);
    }

    @Override
    @Transactional
    public void cancelSubOrder(Long subOrderId, Long userId, String reason) {
        SubOrder subOrder = subOrderHelper.findByIdOrThrow(subOrderId);
        subOrderHelper.verifyBuyerOrSellerAccess(subOrder, userId);
        subOrderHelper.validateBuyerCanCancel(subOrder, userId);

        subOrder.updateStatus(SubOrderStatus.CANCELLED, userId, reason);
        subOrder.setCancelledAt(LocalDateTime.now());

        subOrderRepository.save(subOrder);
        log.info("Sub-order {} cancelled by user {}", subOrderId, userId);
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

    private SubOrderDTO convertToDTO(SubOrder subOrder) {
        return modelMapper.map(subOrder, SubOrderDTO.class);
    }
}
