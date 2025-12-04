package com.ecom.order.service.impl;

import com.ecom.common.exception.InsufficientStockException;
import com.ecom.common.exception.OrderGroupNotFoundException;
import com.ecom.common.exception.UnauthorizedException;
import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.client.UserServiceClient;
import com.ecom.order.dto.*;
import com.ecom.order.entity.*;
import com.ecom.order.mapper.AdminOrderMapper;
import com.ecom.order.payment.PaymentIntent;
import com.ecom.order.repository.CartRepository;
import com.ecom.order.repository.OrderGroupRepository;
import com.ecom.order.service.signature.OrderGroupService;
import com.ecom.order.service.signature.PaymentService;
import com.ecom.order.utils.OrderUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderGroupServiceImpl implements OrderGroupService {

    private final OrderGroupRepository orderGroupRepository;
    private final CartRepository cartRepository;
    private final PaymentService paymentService;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;
    private final AdminOrderMapper adminOrderMapper;

    /**
     * Create Order Group from Cart (Multi-Seller Support)
     * Automatically groups items by seller
     */
    @Transactional
    public OrderGroupDTO createFromCart(Long userId, CreateOrderRequest request) {
        // 1. Get cart
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new IllegalStateException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        // 2. Enrich and validate cart items
        enrichAndValidateCartItems(cart);

        // 3. Group items by seller
        Map<Long, List<CartItem>> itemsBySeller = cart.getItems().stream()
                .collect(Collectors.groupingBy(CartItem::getSellerId));

        log.info("Creating order group for user {} with {} sellers",
                userId, itemsBySeller.size());

        // 4. Create Order Group
        OrderGroup group = OrderGroup.builder()
                .groupNumber(generateGroupNumber())
                .userId(userId)
                .overallStatus(OrderGroupStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingAddressId(request.getAddressId())
                .currency("USD")
                .build();

        // 5. Create Sub-Order for each seller
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> sellerItems = entry.getValue();

            SubOrder subOrder = createSubOrder(group, sellerId, sellerItems);
            group.addSubOrder(subOrder);

            totalAmount = totalAmount.add(subOrder.getTotal());
        }

        group.setTotalAmount(totalAmount);
        group.recalculateTotals();

        // 6. Save order group
        group = orderGroupRepository.save(group);

        log.info("Created order group {} with {} sub-orders, total: {}",
                group.getGroupNumber(), group.getSubOrders().size(), totalAmount);

        // 7. Initialize payment
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(
                group, request.getPaymentProvider(), request.getIdempotencyKey());

        // 8. Clear cart
        cart.clearItems();
        cartRepository.save(cart);

        // 9. Convert to DTO
        OrderGroupDTO dto = convertToDTO(group);
        dto.setPaymentClientSecret(paymentIntent.getClientSecret());

        return dto;
    }

    /**
     * Get order group by ID
     */
    @Transactional(readOnly = true)
    public OrderGroupDTO getOrderGroup(Long groupId, Long userId) {
        OrderGroup group = orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        // Verify ownership
        if (!group.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to view this order");
        }

        return convertToDTO(group);
    }

    /**
     * Get user's order groups
     */
    @Transactional(readOnly = true)
    public Page<OrderGroupDTO> getUserOrderGroups(Long userId, Pageable pageable) {
        Page<OrderGroup> groups = orderGroupRepository.findByUserId(userId, pageable);
        return groups.map(this::convertToDTO);
    }

    /**
     * Cancel order group
     */
    @Transactional
    public void cancelOrderGroup(Long groupId, Long userId) {
        OrderGroup group = orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        // Verify ownership
        if (!group.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not authorized");
        }

        // Can only cancel if payment pending or failed
        if (group.getPaymentStatus() != PaymentStatus.PENDING &&
                group.getPaymentStatus() != PaymentStatus.FAILED) {
            throw new IllegalStateException("Cannot cancel order after payment");
        }

        // Cancel all sub-orders
        for (SubOrder subOrder : group.getSubOrders()) {
            subOrder.updateStatus(SubOrderStatus.CANCELLED, userId, "Order group cancelled");
        }

        group.setOverallStatus(OrderGroupStatus.CANCELLED);
        orderGroupRepository.save(group);

        log.info("Cancelled order group: {}", group.getGroupNumber());
    }

    /**
     * Create sub-order for a seller
     */
    private SubOrder createSubOrder(OrderGroup group, Long sellerId, List<CartItem> items) {
        // Get seller name from first item
        String sellerName = items.get(0).getSellerName();

        SubOrder subOrder = SubOrder.builder()
                .subOrderNumber(generateSubOrderNumber(group.getGroupNumber(), sellerId))
                .orderGroup(group)
                .sellerId(sellerId)
                .sellerName(sellerName)
                .status(SubOrderStatus.PENDING)
                .build();

        // Add items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : items) {
            SubOrderItem orderItem = SubOrderItem.builder()
                    .subOrder(subOrder)
                    .productId(cartItem.getProductId())
                    .variantId(cartItem.getVariantId())
                    .productName(cartItem.getProductName())
                    .variantName(cartItem.getVariantName())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getPrice())
                    .build();

            orderItem.calculateTotalPrice();
            subOrder.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }

        // Calculate shipping and tax
        BigDecimal shipping = calculateShippingForSeller(sellerId, items);
        BigDecimal tax = calculateTax(subtotal, shipping);

        subOrder.setSubtotal(subtotal);
        subOrder.setShippingCost(shipping);
        subOrder.setTax(tax);
        subOrder.setTotal(subtotal.add(shipping).add(tax));

        return subOrder;
    }

    /**
     * Enrich cart items with product details and validate
     */
    private void enrichAndValidateCartItems(Cart cart) {
        for (CartItem item : cart.getItems()) {
            // Get product details
            var response = productServiceClient.getProductDetails(
                    item.getProductId(), item.getVariantId());

            if (response == null || !response.isSuccess() || response.getData() == null) {
                throw new IllegalStateException("Product not found: " + item.getProductId());
            }

            ProductDetails details = response.getData();

            item.setProductName(details.getName());
            item.setImageUrl(details.getImageUrl());
            item.setSellerId(details.getSellerId());
            item.setSellerName(details.getSellerName());
            item.setVariantName(details.getVariantName());

            // Validate stock
            boolean inStock = productServiceClient.validateStock(
                    item.getProductId(), item.getVariantId(), item.getQuantity());

            if (!inStock) {
                throw new InsufficientStockException(
                        "Product " + details.getName() + " is out of stock");
            }
        }
    }

    /**
     * Calculate shipping cost for seller
     */
    private BigDecimal calculateShippingForSeller(Long sellerId, List<CartItem> items) {
        // TODO: Implement shipping calculation logic
        // For now, flat rate
        return BigDecimal.valueOf(5.00);
    }

    /**
     * Calculate tax
     */
    private BigDecimal calculateTax(BigDecimal subtotal, BigDecimal shipping) {
        // TODO: Implement tax calculation (based on address, etc.)
        // For now, 10% tax
        return subtotal.add(shipping).multiply(BigDecimal.valueOf(0.10));
    }

    /**
     * Generate unique order group number
     */
    private String generateGroupNumber() {
        return "OG-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * Generate sub-order number
     */
    private String generateSubOrderNumber(String groupNumber, Long sellerId) {
        return groupNumber + "-S" + sellerId;
    }

    /**
     * Convert to DTO
     */
    private OrderGroupDTO convertToDTO(OrderGroup group) {
        OrderGroupDTO dto = modelMapper.map(group, OrderGroupDTO.class);

        // Map sub-orders
        List<SubOrderDTO> subOrderDTOs = group.getSubOrders().stream()
                .map(so -> modelMapper.map(so, SubOrderDTO.class))
                .collect(Collectors.toList());

        dto.setSubOrders(subOrderDTOs);

        return dto;
    }

    /**
     * Admin: Get all orders with filtering
     */
    @Override
    @Transactional(readOnly = true)
    public Page<AdminOrderGroupDTO> getAllOrdersAdmin(OrderFilterRequest filter) {
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

        Pageable pageable = org.springframework.data.domain.PageRequest.of(
                filter.getPageNumber(),
                filter.getPageSize(),
                filter.getSortDirection(),
                filter.getSortBy());

        Page<OrderGroup> orders = orderGroupRepository.findAll(spec, pageable);

        return orders.map(order -> {
            UserDTO user = userServiceClient.getUserSafe(order.getUserId());
            // For list view, we might not need full addresses to save performance, but
            // let's fetch for now
            return adminOrderMapper.toAdminDTO(order, user, null, null);
        });
    }

    /**
     * Admin: Get order details
     */
    @Override
    @Transactional(readOnly = true)
    public AdminOrderGroupDTO getOrderDetailsAdmin(Long groupId) {
        OrderGroup group = orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        UserDTO user = userServiceClient.getUserSafe(group.getUserId());
        AddressDTO shipping = userServiceClient.getAddressSafe(group.getShippingAddressId());
        AddressDTO billing = group.getBillingAddressId() != null
                ? userServiceClient.getAddressSafe(group.getBillingAddressId())
                : null;

        return adminOrderMapper.toAdminDTO(group, user, shipping, billing);
    }

    /**
     * Admin: Update overall order status
     */
    @Override
    @Transactional
    public AdminOrderGroupDTO updateOrderStatus(Long groupId, String newStatus, String notes) {
        OrderGroup group = orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        try {
            OrderGroupStatus status = OrderGroupStatus.valueOf(newStatus);
            group.setOverallStatus(status);

            // If cancelled, cancel all sub-orders
            if (status == OrderGroupStatus.CANCELLED) {
                for (SubOrder subOrder : group.getSubOrders()) {
                    if (subOrder.getStatus() != SubOrderStatus.CANCELLED &&
                            subOrder.getStatus() != SubOrderStatus.DELIVERED) {
                        subOrder.updateStatus(SubOrderStatus.CANCELLED, null, "Admin cancelled order group: " + notes);
                    }
                }
            }

            group = orderGroupRepository.save(group);
            return getOrderDetailsAdmin(groupId);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
    }

    /**
     * Admin: Update sub-order status
     */
    @Override
    @Transactional
    public AdminSubOrderDTO updateSubOrderStatus(Long groupId, Long subOrderId, String newStatus, Long adminId,
            String notes) {
        OrderGroup group = orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        SubOrder subOrder = group.getSubOrders().stream()
                .filter(so -> so.getId().equals(subOrderId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Sub-order not found: " + subOrderId));

        try {
            SubOrderStatus status = SubOrderStatus.valueOf(newStatus);
            subOrder.updateStatus(status, adminId, notes);

            orderGroupRepository.save(group); // Will cascade update to sub-order and trigger overall status update

            return adminOrderMapper.toAdminSubOrderDTO(subOrder);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
    }

    /**
     * Admin: Update tracking info
     */
    @Override
    @Transactional
    public AdminSubOrderDTO updateSubOrderTracking(Long groupId, Long subOrderId, TrackingUpdateRequest request) {
        OrderGroup group = orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));

        SubOrder subOrder = group.getSubOrders().stream()
                .filter(so -> so.getId().equals(subOrderId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Sub-order not found: " + subOrderId));

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

        orderGroupRepository.save(group);

        return adminOrderMapper.toAdminSubOrderDTO(subOrder);
    }
}
