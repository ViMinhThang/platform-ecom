package com.ecom.order.service.impl;

import com.ecom.order.client.UserServiceClient;
import com.ecom.order.config.OrderConfigurationProperties;
import com.ecom.order.dto.*;
import com.ecom.order.entity.*;
import com.ecom.order.event.OrderEventPublisher;
import com.ecom.order.helper.*;
import com.ecom.order.mapper.AdminOrderMapper;
import com.ecom.order.mapper.OrderMapping;
import com.ecom.order.payment.PaymentIntent;
import com.ecom.order.repository.*;
import com.ecom.order.service.OrderCalculator;

import com.ecom.order.service.signature.CartValidationService;
import com.ecom.order.service.signature.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderGroupServiceImpl implements OrderGroupService {

    private final OrderGroupRepository orderGroupRepository;
    private final PaymentService paymentService;
    private final UserServiceClient userServiceClient;
    private final AdminOrderMapper adminOrderMapper;
    private final OrderEventPublisher orderEventPublisher;

    private final CartValidationService cartValidationService;
    private final OrderQueryHelper orderQueryHelper;
    private final OrderCalculator orderCalculator;
    private final OrderCreationHelper orderCreationHelper;
    private final OrderValidationHelper orderValidationHelper;
    private final OrderPaymentHelper paymentHelper;
    private final OrderMapping mappingHelper;
    private final OrderActionHelper actionHelper;
    private final CartHelper cartHelper;

    private final DiscountService discountService;
    private final OrderConfigurationProperties properties;

    @Override
    @Transactional(readOnly = true)
    public CheckoutSessionDTO initiateCheckout(Long userId, CreateOrderRequest request) {
        Cart cart = cartValidationService.getValidatedCart(userId);
        cartValidationService.enrichAndValidateCartItems(cart);

        BigDecimal grandTotal = orderCalculator.calculateGrandTotal(cart, request.getShippingFee());
        log.info("Initiating checkout for user {} with total: {}", userId, grandTotal);

        PaymentIntent paymentIntent = paymentService.createPaymentIntent(
                grandTotal, properties.getDefaultCurrency(), "Checkout for user " + userId,
                userId, request.getIdempotencyKey());

        return mappingHelper.buildCheckoutSession(paymentIntent, grandTotal, request.getAddressId(), cart);
    }

    @Override
    @Transactional
    public OrderGroupDTO confirmPaymentAndCreateOrder(Long userId, ConfirmPaymentRequest request) {
        log.info("Confirming payment {} for user {}", request.getPaymentIntentId(), userId);

        paymentHelper.verifyPaymentNotDuplicate(request.getPaymentIntentId());
        paymentService.verifyPaymentSucceeded(request.getPaymentIntentId());

        Cart cart = cartValidationService.getValidatedCart(userId);
        cartValidationService.enrichAndValidateCartItems(cart);

        OrderGroup orderGroup = orderCreationHelper.buildOrderGroup(
                userId, cart, request.getAddressId(), request.getShippingFee());
        orderGroup = orderGroupRepository.save(orderGroup);

        applyDiscounts(orderGroup, cart, request);

        paymentHelper.recordPaymentTransaction(orderGroup, request.getPaymentIntentId());
        orderEventPublisher.publishOrderCreated(orderGroup);
        cartHelper.clearCart(cart);

        log.info("Created order {} with {} sub-orders, total: {}, discount: {}",
                orderGroup.getGroupNumber(), orderGroup.getSubOrders().size(),
                orderGroup.getTotalAmount(), orderGroup.getDiscountAmount());

        return mappingHelper.convertToDTO(orderGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderGroupDTO getOrderGroup(Long groupId, Long userId) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        orderValidationHelper.verifyUserOwnership(group, userId);
        return mappingHelper.convertToDTO(group);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderGroupDTO> getUserOrderGroups(Long userId, Pageable pageable) {
        return orderGroupRepository.findByUserId(userId, pageable).map(mappingHelper::convertToDTO);
    }

    @Override
    @Transactional
    public void cancelOrderGroup(Long groupId, Long userId) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        orderValidationHelper.verifyUserOwnership(group, userId);
        orderValidationHelper.validateCancellable(group);

        actionHelper.cancelAllSubOrders(group, userId);
        group.setOverallStatus(OrderGroupStatus.CANCELLED);
        orderGroupRepository.save(group);

        log.info("Cancelled order group: {}", group.getGroupNumber());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminOrderGroupDTO> getAllOrdersAdmin(OrderFilterRequest filter) {
        Specification<OrderGroup> spec = orderQueryHelper.buildFilterSpecification(filter);
        Pageable pageable = orderQueryHelper.buildPageable(filter);

        return orderGroupRepository.findAll(spec, pageable)
                .map(order -> adminOrderMapper.toAdminDTO(
                        order, userServiceClient.getUserSafe(order.getUserId()), null, null));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderGroupDTO getOrderDetailsAdmin(Long groupId) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);

        UserDTO user = userServiceClient.getUserSafe(group.getUserId());
        AddressDTO shippingAddress = userServiceClient.getAddressSafe(group.getShippingAddressId());
        AddressDTO billingAddress = fetchBillingAddress(group);

        return adminOrderMapper.toAdminDTO(group, user, shippingAddress, billingAddress);
    }

    @Override
    @Transactional
    public AdminOrderGroupDTO updateOrderStatus(Long groupId, String newStatus, String notes) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        OrderGroupStatus status = orderValidationHelper.parseOrderGroupStatus(newStatus);

        group.setOverallStatus(status);
        if (status == OrderGroupStatus.CANCELLED) {
            actionHelper.cancelActiveSubOrders(group, notes);
        }

        orderGroupRepository.save(group);
        return getOrderDetailsAdmin(groupId);
    }

    @Override
    @Transactional
    public AdminSubOrderDTO updateSubOrderStatus(Long groupId, Long subOrderId, String newStatus,
            Long adminId, String notes) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        SubOrder subOrder = orderValidationHelper.findSubOrderInGroup(group, subOrderId);

        SubOrderStatus status = orderValidationHelper.parseSubOrderStatus(newStatus);
        subOrder.updateStatus(status, adminId, notes);
        orderGroupRepository.save(group);

        return adminOrderMapper.toAdminSubOrderDTO(subOrder);
    }

    @Override
    @Transactional
    public AdminSubOrderDTO updateSubOrderTracking(Long groupId, Long subOrderId, TrackingUpdateRequest request) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        SubOrder subOrder = orderValidationHelper.findSubOrderInGroup(group, subOrderId);

        actionHelper.applyTrackingUpdates(subOrder, request);
        orderGroupRepository.save(group);

        return adminOrderMapper.toAdminSubOrderDTO(subOrder);
    }

    // ==================== Private Helper Methods ====================

    private void applyDiscounts(OrderGroup orderGroup, Cart cart, ConfirmPaymentRequest request) {
        DiscountResultDTO discountResult = discountService.applyVouchers(
                orderGroup.getId(), cart, request.getShippingFee(),
                request.getVoucherCode(), orderGroup.getUserId());

        if (discountResult.getTotalDiscount().compareTo(BigDecimal.ZERO) > 0) {
            orderGroup.setDiscountAmount(discountResult.getTotalDiscount());
            if (discountResult.getAppliedProductVoucher() != null) {
                orderGroup.setAppliedProductVoucherId(discountResult.getAppliedProductVoucher().getId());
            }
            if (discountResult.getAppliedShippingVoucher() != null) {
                orderGroup.setAppliedShippingVoucherId(discountResult.getAppliedShippingVoucher().getId());
            }
            orderGroup.setTotalAmount(orderGroup.getTotalAmount().subtract(discountResult.getTotalDiscount()));
            orderGroupRepository.save(orderGroup);
        }
    }

    private AddressDTO fetchBillingAddress(OrderGroup group) {
        return group.getBillingAddressId() != null
                ? userServiceClient.getAddressSafe(group.getBillingAddressId())
                : null;
    }
}
