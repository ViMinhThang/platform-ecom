package com.ecom.order.service.impl;

import com.ecom.common.exception.*;
import com.ecom.order.client.UserServiceClient;
import com.ecom.order.config.OrderConfigurationProperties;
import com.ecom.order.dto.*;
import com.ecom.order.entity.*;
import com.ecom.order.event.OrderEventPublisher;
import com.ecom.order.mapper.AdminOrderMapper;
import com.ecom.order.payment.PaymentIntent;
import com.ecom.order.repository.*;
import com.ecom.order.service.OrderCalculator;
import com.ecom.order.service.OrderCreationHelper;
import com.ecom.order.service.OrderNumberGenerator;
import com.ecom.order.service.OrderQueryHelper;
import com.ecom.order.service.OrderValidationHelper;
import com.ecom.order.service.signature.CartValidationService;
import com.ecom.order.service.signature.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderGroupServiceImpl implements OrderGroupService {

    // Core Dependencies
    private final OrderGroupRepository orderGroupRepository;
    private final CartRepository cartRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final PaymentService paymentService;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;
    private final AdminOrderMapper adminOrderMapper;
    private final OrderEventPublisher orderEventPublisher;

    // Helpers
    private final CartValidationService cartValidationService;
    private final OrderQueryHelper orderQueryHelper;
    private final OrderCalculator orderCalculator;
    private final OrderCreationHelper orderCreationHelper;
    private final OrderValidationHelper orderValidationHelper;
    private final OrderNumberGenerator orderNumberGenerator;

    private final OrderConfigurationProperties properties;

    // ==================== Public API ====================

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

        return buildCheckoutSession(paymentIntent, grandTotal, request.getAddressId(), cart);
    }

    @Override
    @Transactional
    public OrderGroupDTO confirmPaymentAndCreateOrder(Long userId, ConfirmPaymentRequest request) {
        log.info("Confirming payment {} for user {}", request.getPaymentIntentId(), userId);

        verifyPaymentNotDuplicate(request.getPaymentIntentId());
        paymentService.verifyPaymentSucceeded(request.getPaymentIntentId());

        Cart cart = cartValidationService.getValidatedCart(userId);
        cartValidationService.enrichAndValidateCartItems(cart);

        OrderGroup orderGroup = orderCreationHelper.buildOrderGroup(
                userId, cart, request.getAddressId(), request.getShippingFee());
        orderGroup = orderGroupRepository.save(orderGroup);

        recordPaymentTransaction(orderGroup, request.getPaymentIntentId());
        orderEventPublisher.publishOrderCreated(orderGroup);
        clearCart(cart);

        log.info("Created order {} with {} sub-orders, total: {}",
                orderGroup.getGroupNumber(), orderGroup.getSubOrders().size(), orderGroup.getTotalAmount());

        return convertToDTO(orderGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderGroupDTO getOrderGroup(Long groupId, Long userId) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        orderValidationHelper.verifyUserOwnership(group, userId);
        return convertToDTO(group);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderGroupDTO> getUserOrderGroups(Long userId, Pageable pageable) {
        return orderGroupRepository.findByUserId(userId, pageable).map(this::convertToDTO);
    }

    @Override
    @Transactional
    public void cancelOrderGroup(Long groupId, Long userId) {
        OrderGroup group = orderValidationHelper.findOrderGroupById(groupId);
        orderValidationHelper.verifyUserOwnership(group, userId);
        orderValidationHelper.validateCancellable(group);

        cancelAllSubOrders(group, userId);
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
            cancelActiveSubOrders(group, notes);
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

        applyTrackingUpdates(subOrder, request);
        orderGroupRepository.save(group);

        return adminOrderMapper.toAdminSubOrderDTO(subOrder);
    }

    // ==================== Private Helpers: Payment ====================

    private void verifyPaymentNotDuplicate(String paymentIntentId) {
        if (transactionRepository.existsByProviderTransactionId(paymentIntentId)) {
            log.warn("Order already created for payment: {}", paymentIntentId);
            throw new PaymentException("Order already created for this payment");
        }
    }

    private void recordPaymentTransaction(OrderGroup group, String paymentIntentId) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .orderGroup(group)
                .provider(properties.getPaymentProvider())
                .providerTransactionId(paymentIntentId)
                .paymentMethod(properties.getPaymentMethod())
                .amount(group.getTotalAmount())
                .currency(properties.getDefaultCurrency())
                .status(PaymentStatus.SUCCEEDED)
                .idempotencyKey(paymentIntentId)
                .completedAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
    }

    // ==================== Private Helpers: Cancellation ====================

    private void cancelAllSubOrders(OrderGroup group, Long userId) {
        for (SubOrder subOrder : group.getSubOrders()) {
            subOrder.updateStatus(SubOrderStatus.CANCELLED, userId, "Order group cancelled");
        }
    }

    private void cancelActiveSubOrders(OrderGroup group, String notes) {
        for (SubOrder subOrder : group.getSubOrders()) {
            if (subOrder.getStatus() != SubOrderStatus.CANCELLED
                    && subOrder.getStatus() != SubOrderStatus.DELIVERED) {
                subOrder.updateStatus(SubOrderStatus.CANCELLED, null, "Admin cancelled: " + notes);
            }
        }
    }

    private AddressDTO fetchBillingAddress(OrderGroup group) {
        return group.getBillingAddressId() != null
                ? userServiceClient.getAddressSafe(group.getBillingAddressId())
                : null;
    }

    private void applyTrackingUpdates(SubOrder subOrder, TrackingUpdateRequest request) {
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

    // ==================== Private Helpers: Conversion ====================

    private CheckoutSessionDTO buildCheckoutSession(PaymentIntent intent, BigDecimal amount,
            Long addressId, Cart cart) {
        List<CartItemDTO> items = cart.getItems().stream()
                .map(item -> modelMapper.map(item, CartItemDTO.class))
                .collect(Collectors.toList());

        return CheckoutSessionDTO.builder()
                .clientSecret(intent.getClientSecret())
                .paymentIntentId(intent.getId())
                .amount(amount)
                .currency(properties.getDefaultCurrency())
                .addressId(addressId)
                .items(items)
                .build();
    }

    private OrderGroupDTO convertToDTO(OrderGroup group) {
        OrderGroupDTO dto = modelMapper.map(group, OrderGroupDTO.class);
        dto.setSubOrders(group.getSubOrders().stream()
                .map(so -> modelMapper.map(so, SubOrderDTO.class))
                .collect(Collectors.toList()));
        return dto;
    }

    private void clearCart(Cart cart) {
        cart.clearItems();
        cartRepository.save(cart);
    }
}
