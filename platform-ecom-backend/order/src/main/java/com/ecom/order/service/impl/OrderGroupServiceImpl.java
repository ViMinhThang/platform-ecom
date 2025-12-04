package com.ecom.order.service.impl;

import com.ecom.common.exception.InsufficientStockException;
import com.ecom.common.exception.OrderGroupNotFoundException;
import com.ecom.common.exception.PaymentException;
import com.ecom.common.exception.UnauthorizedException;
import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.client.UserServiceClient;
import com.ecom.order.dto.*;
import com.ecom.order.entity.*;
import com.ecom.order.event.OrderEventPublisher;
import com.ecom.order.mapper.AdminOrderMapper;
import com.ecom.order.payment.PaymentIntent;
import com.ecom.order.repository.CartRepository;
import com.ecom.order.repository.OrderGroupRepository;
import com.ecom.order.repository.PaymentTransactionRepository;
import com.ecom.order.service.signature.OrderGroupService;
import com.ecom.order.service.signature.PaymentService;
import com.ecom.order.utils.OrderUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderGroupServiceImpl implements OrderGroupService {

    // Constants
    private static final String DEFAULT_CURRENCY = "USD";
    private static final BigDecimal FLAT_SHIPPING_FEE = BigDecimal.valueOf(5.00);
    private static final BigDecimal TAX_RATE = BigDecimal.valueOf(0.10);
    private static final String PAYMENT_PROVIDER = "stripe";
    private static final String PAYMENT_METHOD = "card";

    // Dependencies
    private final OrderGroupRepository orderGroupRepository;
    private final CartRepository cartRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final PaymentService paymentService;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;
    private final AdminOrderMapper adminOrderMapper;
    private final OrderEventPublisher orderEventPublisher;

    // ==================== Public API ====================

    @Override
    @Transactional(readOnly = true)
    public CheckoutSessionDTO initiateCheckout(Long userId, CreateOrderRequest request) {
        Cart cart = getValidatedCart(userId);
        enrichAndValidateCartItems(cart);

        BigDecimal grandTotal = calculateGrandTotal(cart);
        log.info("Initiating checkout for user {} with total: {}", userId, grandTotal);

        PaymentIntent paymentIntent = paymentService.createPaymentIntent(
                grandTotal, DEFAULT_CURRENCY, "Checkout for user " + userId,
                userId, request.getIdempotencyKey());

        return buildCheckoutSession(paymentIntent, grandTotal, request.getAddressId(), cart);
    }

    @Override
    @Transactional
    public OrderGroupDTO confirmPaymentAndCreateOrder(Long userId, ConfirmPaymentRequest request) {
        log.info("Confirming payment {} for user {}", request.getPaymentIntentId(), userId);

        verifyPaymentNotDuplicate(request.getPaymentIntentId());
        paymentService.verifyPaymentSucceeded(request.getPaymentIntentId());

        Cart cart = getValidatedCart(userId);
        enrichAndValidateCartItems(cart);

        OrderGroup orderGroup = createOrderGroup(userId, cart, request.getAddressId());
        recordPaymentTransaction(orderGroup, request.getPaymentIntentId());
        
        // Publish Kafka event for stock/sales updates
        orderEventPublisher.publishOrderCreated(orderGroup);
        
        clearCart(cart);

        log.info("Created order {} with {} sub-orders, total: {}",
                orderGroup.getGroupNumber(), orderGroup.getSubOrders().size(), orderGroup.getTotalAmount());

        return convertToDTO(orderGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderGroupDTO getOrderGroup(Long groupId, Long userId) {
        OrderGroup group = findOrderGroupById(groupId);
        verifyUserOwnership(group, userId);
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
        OrderGroup group = findOrderGroupById(groupId);
        verifyUserOwnership(group, userId);
        validateCancellable(group);

        cancelAllSubOrders(group, userId);
        group.setOverallStatus(OrderGroupStatus.CANCELLED);
        orderGroupRepository.save(group);

        log.info("Cancelled order group: {}", group.getGroupNumber());
    }

    // ==================== Admin Methods ====================

    @Override
    @Transactional(readOnly = true)
    public Page<AdminOrderGroupDTO> getAllOrdersAdmin(OrderFilterRequest filter) {
        Specification<OrderGroup> spec = buildFilterSpecification(filter);
        Pageable pageable = buildPageable(filter);

        return orderGroupRepository.findAll(spec, pageable)
                .map(order -> adminOrderMapper.toAdminDTO(
                        order, userServiceClient.getUserSafe(order.getUserId()), null, null));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderGroupDTO getOrderDetailsAdmin(Long groupId) {
        OrderGroup group = findOrderGroupById(groupId);

        UserDTO user = userServiceClient.getUserSafe(group.getUserId());
        AddressDTO shippingAddress = userServiceClient.getAddressSafe(group.getShippingAddressId());
        AddressDTO billingAddress = fetchBillingAddress(group);

        return adminOrderMapper.toAdminDTO(group, user, shippingAddress, billingAddress);
    }

    @Override
    @Transactional
    public AdminOrderGroupDTO updateOrderStatus(Long groupId, String newStatus, String notes) {
        OrderGroup group = findOrderGroupById(groupId);
        OrderGroupStatus status = parseOrderGroupStatus(newStatus);

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
        OrderGroup group = findOrderGroupById(groupId);
        SubOrder subOrder = findSubOrderInGroup(group, subOrderId);

        SubOrderStatus status = parseSubOrderStatus(newStatus);
        subOrder.updateStatus(status, adminId, notes);
        orderGroupRepository.save(group);

        return adminOrderMapper.toAdminSubOrderDTO(subOrder);
    }

    @Override
    @Transactional
    public AdminSubOrderDTO updateSubOrderTracking(Long groupId, Long subOrderId, TrackingUpdateRequest request) {
        OrderGroup group = findOrderGroupById(groupId);
        SubOrder subOrder = findSubOrderInGroup(group, subOrderId);

        applyTrackingUpdates(subOrder, request);
        orderGroupRepository.save(group);

        return adminOrderMapper.toAdminSubOrderDTO(subOrder);
    }

    // ==================== Private Helpers: Cart & Validation ====================

    private Cart getValidatedCart(Long userId) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new IllegalStateException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }
        return cart;
    }

    private void enrichAndValidateCartItems(Cart cart) {
        for (CartItem item : cart.getItems()) {
            ProductDetails details = fetchProductDetails(item);
            updateCartItemWithProductDetails(item, details);
            validateStockAvailability(item, details);
        }
    }

    private ProductDetails fetchProductDetails(CartItem item) {
        var response = productServiceClient.getProductDetails(item.getProductId(), item.getVariantId());

        if (response == null || !response.isSuccess() || response.getData() == null) {
            throw new IllegalStateException("Product not found: " + item.getProductId());
        }
        return response.getData();
    }

    private void updateCartItemWithProductDetails(CartItem item, ProductDetails details) {
        item.setProductName(details.getName());
        item.setImageUrl(details.getImageUrl());
        item.setSellerId(details.getSellerId());
        item.setSellerName(details.getSellerName());
        item.setVariantName(details.getVariantName());
    }

    private void validateStockAvailability(CartItem item, ProductDetails details) {
        boolean inStock = productServiceClient.validateStock(
                item.getProductId(), item.getVariantId(), item.getQuantity());

        if (!inStock) {
            throw new InsufficientStockException("Product " + details.getName() + " is out of stock");
        }
    }

    // ==================== Private Helpers: Calculation ====================

    private BigDecimal calculateGrandTotal(Cart cart) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(TAX_RATE);
        return subtotal.add(FLAT_SHIPPING_FEE).add(tax);
    }

    private BigDecimal calculateSubOrderTotal(BigDecimal subtotal) {
        BigDecimal tax = subtotal.add(FLAT_SHIPPING_FEE).multiply(TAX_RATE);
        return subtotal.add(FLAT_SHIPPING_FEE).add(tax);
    }

    // ==================== Private Helpers: Order Creation ====================

    private OrderGroup createOrderGroup(Long userId, Cart cart, Long addressId) {
        Map<Long, List<CartItem>> itemsBySeller = groupItemsBySeller(cart);

        OrderGroup group = OrderGroup.builder()
                .groupNumber(generateGroupNumber())
                .userId(userId)
                .overallStatus(OrderGroupStatus.PAID)
                .paymentStatus(PaymentStatus.SUCCEEDED)
                .shippingAddressId(addressId)
                .currency(DEFAULT_CURRENCY)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            SubOrder subOrder = createSubOrder(group, entry.getKey(), entry.getValue());
            group.addSubOrder(subOrder);
            totalAmount = totalAmount.add(subOrder.getTotal());
        }

        group.setTotalAmount(totalAmount);
        group.recalculateTotals();

        return orderGroupRepository.save(group);
    }

    private SubOrder createSubOrder(OrderGroup group, Long sellerId, List<CartItem> items) {
        String sellerName = items.get(0).getSellerName();

        SubOrder subOrder = SubOrder.builder()
                .subOrderNumber(generateSubOrderNumber(group.getGroupNumber(), sellerId))
                .orderGroup(group)
                .sellerId(sellerId)
                .sellerName(sellerName)
                .status(SubOrderStatus.PENDING)
                .build();

        BigDecimal subtotal = addItemsToSubOrder(subOrder, items);
        setSubOrderFinancials(subOrder, subtotal);

        return subOrder;
    }

    private BigDecimal addItemsToSubOrder(SubOrder subOrder, List<CartItem> items) {
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : items) {
            SubOrderItem orderItem = SubOrderItem.builder()
                    .subOrder(subOrder)
                    .productId(cartItem.getProductId())
                    .variantId(cartItem.getVariantId())
                    .productName(cartItem.getProductName())
                    .variantName(cartItem.getVariantName())
                    .imageUrl(cartItem.getImageUrl())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getPrice())
                    .build();

            orderItem.calculateTotalPrice();
            subOrder.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }
        return subtotal;
    }

    private void setSubOrderFinancials(SubOrder subOrder, BigDecimal subtotal) {
        BigDecimal tax = subtotal.add(FLAT_SHIPPING_FEE).multiply(TAX_RATE);

        subOrder.setSubtotal(subtotal);
        subOrder.setShippingCost(FLAT_SHIPPING_FEE);
        subOrder.setTax(tax);
        subOrder.setTotal(subtotal.add(FLAT_SHIPPING_FEE).add(tax));
    }

    private Map<Long, List<CartItem>> groupItemsBySeller(Cart cart) {
        return cart.getItems().stream().collect(Collectors.groupingBy(CartItem::getSellerId));
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
                .provider(PAYMENT_PROVIDER)
                .providerTransactionId(paymentIntentId)
                .paymentMethod(PAYMENT_METHOD)
                .amount(group.getTotalAmount())
                .currency(DEFAULT_CURRENCY)
                .status(PaymentStatus.SUCCEEDED)
                .idempotencyKey(paymentIntentId)
                .completedAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
    }

    // ==================== Private Helpers: Order Retrieval ====================

    private OrderGroup findOrderGroupById(Long groupId) {
        return orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));
    }

    private SubOrder findSubOrderInGroup(OrderGroup group, Long subOrderId) {
        return group.getSubOrders().stream()
                .filter(so -> so.getId().equals(subOrderId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Sub-order not found: " + subOrderId));
    }

    // ==================== Private Helpers: Authorization ====================

    private void verifyUserOwnership(OrderGroup group, Long userId) {
        if (!group.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to access this order");
        }
    }

    // ==================== Private Helpers: Cancellation ====================

    private void validateCancellable(OrderGroup group) {
        boolean allCancellable = group.getSubOrders().stream()
                .allMatch(so -> so.getStatus() == SubOrderStatus.PENDING
                        || so.getStatus() == SubOrderStatus.PROCESSING);

        if (!allCancellable) {
            throw new IllegalStateException("Cannot cancel order - items already shipped");
        }
    }

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

    // ==================== Private Helpers: Admin Filter ====================

    private Specification<OrderGroup> buildFilterSpecification(OrderFilterRequest filter) {
        Specification<OrderGroup> spec = Specification.where(null);

        if (filter.getGroupNumber() != null) {
            spec = spec.and(OrderUtils.groupNumberContains(filter.getGroupNumber()));
        }
        if (filter.getOverallStatus() != null) {
            spec = spec.and(OrderUtils.overallStatusEquals(filter.getOverallStatus()));
        }
        if (filter.getPaymentStatus() != null) {
            spec = spec.and(OrderUtils.paymentStatusEquals(filter.getPaymentStatus()));
        }
        if (filter.getStartDate() != null || filter.getEndDate() != null) {
            spec = spec.and(OrderUtils.createdBetween(filter.getStartDate(), filter.getEndDate()));
        }
        if (filter.getMinAmount() != null || filter.getMaxAmount() != null) {
            spec = spec.and(OrderUtils.totalAmountBetween(filter.getMinAmount(), filter.getMaxAmount()));
        }
        if (filter.getSellerName() != null) {
            spec = spec.and(OrderUtils.hasSubOrderWithSeller(filter.getSellerName()));
        }
        return spec;
    }

    private Pageable buildPageable(OrderFilterRequest filter) {
        return PageRequest.of(filter.getPageNumber(), filter.getPageSize(),
                filter.getSortDirection(), filter.getSortBy());
    }

    private AddressDTO fetchBillingAddress(OrderGroup group) {
        return group.getBillingAddressId() != null
                ? userServiceClient.getAddressSafe(group.getBillingAddressId())
                : null;
    }

    // ==================== Private Helpers: Tracking ====================

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

    // ==================== Private Helpers: Parsing ====================

    private OrderGroupStatus parseOrderGroupStatus(String status) {
        try {
            return OrderGroupStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

    private SubOrderStatus parseSubOrderStatus(String status) {
        try {
            return SubOrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sub-order status: " + status);
        }
    }

    // ==================== Private Helpers: Generation ====================

    private String generateGroupNumber() {
        return "OG-" + System.currentTimeMillis() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generateSubOrderNumber(String groupNumber, Long sellerId) {
        return groupNumber + "-S" + sellerId;
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
                .currency(DEFAULT_CURRENCY)
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
