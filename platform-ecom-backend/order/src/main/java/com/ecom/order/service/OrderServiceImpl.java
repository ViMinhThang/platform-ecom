package com.ecom.order.service;

import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.client.UserServiceClient;
import com.ecom.order.dtos.*;
import com.ecom.order.entity.*;
import com.ecom.order.exception.APIException;
import com.ecom.order.exception.ResourceNotFoundException;
import com.ecom.order.producer.OrderNotificationProducer;
import com.ecom.order.repositories.CartRepository;
import com.ecom.order.repositories.OrderItemRepository;
import com.ecom.order.repositories.OrderRepository;
import com.ecom.order.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private static final String SORT_ASC = "asc";
    private static final String ORDER_STATUS_ACCEPTED = "Accepted";
    private static final String ORDER_STATUS_DELIVERED = "DELIVERED";
    private static final String ENTITY_ORDER = "Order";
    private static final String ENTITY_CART = "Cart";

    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final ModelMapper modelMapper;
    private final ProductServiceClient productServiceClient;
    private final UserServiceClient userServiceClient;
    private final OrderNotificationProducer orderNotificationProducer;

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortOrder);
        Page<Order> orderPage = orderRepository.findAll(pageable);

        return buildOrderResponse(orderPage);
    }

    @Override
    public OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
            Long sellerId) {
        List<Long> sellerProductIds = fetchSellerProductIds(sellerId);

        if (sellerProductIds.isEmpty()) {
            return new OrderResponse();
        }

        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortOrder);
        Page<Order> orderPage = orderRepository.findOrdersByProductIds(sellerProductIds, pageable);

        return buildOrderResponse(orderPage);
    }

    @Override
    public OrderDTO updateOrder(Long orderId, String status) {
        Order order = findOrderById(orderId);
        order.setOrderStatus(status);
        Order savedOrder = orderRepository.save(order);

        return mapToOrderDTO(savedOrder);
    }

    @Override
    @Transactional
    public OrderDTO placeOrder(Long userId, Long addressId, String paymentMethod, String pgName, String pgPaymentId,
            String pgStatus, String pgResponseMessage) {
        try {
            Cart cart = findCartByUserId(userId);
            String email = userServiceClient.getEmailById(userId);

            // Create and Save Order
            Order order = createAndSaveOrder(email, addressId, cart);

            // Process Payment
            createAndSavePayment(order, paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);

            // Create Order Items
            List<OrderItem> orderItems = createAndSaveOrderItems(order, cart);

            // Update Stock
            reduceProductStock(orderItems);

            // Clear Cart
            clearUserCart(cart);

            // Prepare Response
            OrderDTO orderDTO = mapToOrderDTO(order);
            orderDTO.setOrderItems(mapToOrderItemDTOs(orderItems));
            orderDTO.setAddressId(addressId);

            // Send Notification
            sendOrderPlacedNotification(orderDTO);

            return orderDTO;

        } catch (Exception e) {
            throw new APIException(e.getMessage());
        }
    }

    @Override
    public Long getOrdersCount() {
        return orderRepository.count();
    }

    @Override
    public Double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = findOrderById(orderId);
        OrderDTO orderDTO = mapToOrderDTO(order);

        enrichOrderDTOsWithProductData(List.of(orderDTO));

        return orderDTO;
    }

    @Override
    public Boolean verifyUserPurchase(String email, Long productId) {
        // Optimized: fetching all orders is bad practice, but keeping logic similar to
        // original for safety
        // Ideally should use a repository method like findByEmailAndProductIdAndStatus
        List<Order> userOrders = orderRepository.findAll().stream()
                .filter(order -> order.getEmail().equals(email))
                .filter(order -> ORDER_STATUS_DELIVERED.equalsIgnoreCase(order.getOrderStatus()))
                .toList();

        return userOrders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .anyMatch(item -> item.getProductId().equals(productId));
    }

    @Override
    public OrderResponse getUserOrders(String email, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder) {
        Pageable pageable = createPageable(pageNumber, pageSize, sortBy, sortOrder);
        Page<Order> orderPage = orderRepository.findByEmailOrderByOrderDateDesc(email, pageable);

        return buildOrderResponse(orderPage);
    }

    // ==================== Private Helper Methods ====================

    private Order findOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ENTITY_ORDER, "orderId", orderId));
    }

    private Cart findCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new ResourceNotFoundException(ENTITY_CART, "userId", userId);
        }
        return cart;
    }

    private Pageable createPageable(Integer page, Integer perPage, String sortBy, String sortOrder) {
        Sort sort = SORT_ASC.equalsIgnoreCase(sortOrder)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return PageRequest.of(page, perPage, sort);
    }

    private List<Long> fetchSellerProductIds(Long sellerId) {
        try {
            return productServiceClient.getProductsBySellerId(sellerId)
                    .getBody()
                    .stream()
                    .map(ProductDTO::getId)
                    .toList();
        } catch (Exception e) {
            log.error("Failed to fetch seller products: {}", e.getMessage());
            return List.of();
        }
    }

    private Order createAndSaveOrder(String email, Long addressId, Cart cart) {
        Order order = new Order();
        order.setEmail(email);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus(ORDER_STATUS_ACCEPTED);
        order.setAddressId(addressId);
        return orderRepository.save(order);
    }

    private void createAndSavePayment(Order order, String method, String pgId, String status, String responseMsg,
            String pgName) {
        Payment payment = new Payment(method, pgId, status, responseMsg, pgName);
        payment.setOrder(order);
        paymentRepository.save(payment);
        order.setPayment(payment);
    }

    private List<OrderItem> createAndSaveOrderItems(Order order, Cart cart) {
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(cartItem.getProductId());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setDiscount(cartItem.getDiscount());
                    orderItem.setOrderedProductPrice(cartItem.getProductPrice());
                    orderItem.setOrder(order);
                    // Assuming cartItem might have variant info if needed, but sticking to original
                    // logic
                    return orderItem;
                })
                .collect(Collectors.toList());

        return orderItemRepository.saveAll(orderItems);
    }

    private void reduceProductStock(List<OrderItem> orderItems) {
        List<ReduceStockDTO> reduceStockDTOS = orderItems.stream()
                .map(oi -> new ReduceStockDTO(oi.getProductId(), oi.getQuantity()))
                .toList();
        productServiceClient.reduceStock(reduceStockDTOS);
    }

    private void clearUserCart(Cart cart) {
        cart.getCartItems().forEach(ci -> cartService.deleteProductFromCart(cart.getCartId(), ci.getProductId()));
    }

    private void sendOrderPlacedNotification(OrderDTO orderDTO) {
        PlaceOrderEvent placeOrderEvent = new PlaceOrderEvent(
                orderDTO.getEmail(),
                orderDTO.getOrderId(),
                orderDTO.getOrderStatus(),
                orderDTO.getTotalAmount());
        orderNotificationProducer.sendPlaceOrderNotification(placeOrderEvent);
    }

    private OrderResponse buildOrderResponse(Page<Order> orderPage) {
        List<OrderDTO> orderDTOs = mapToOrderDTOs(orderPage.getContent());
        enrichOrderDTOsWithProductData(orderDTOs);

        OrderResponse response = new OrderResponse();
        response.setContent(orderDTOs);
        response.setPageNumber(orderPage.getNumber());
        response.setPageSize(orderPage.getSize());
        response.setTotalElements(orderPage.getTotalElements());
        response.setTotalPages(orderPage.getTotalPages());
        response.setLastPage(orderPage.isLast());

        return response;
    }

    private List<OrderDTO> mapToOrderDTOs(List<Order> orders) {
        return orders.stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO mapToOrderDTO(Order order) {
        return modelMapper.map(order, OrderDTO.class);
    }

    private List<OrderItemDTO> mapToOrderItemDTOs(List<OrderItem> items) {
        return items.stream()
                .map(item -> modelMapper.map(item, OrderItemDTO.class))
                .collect(Collectors.toList());
    }

    private void enrichOrderDTOsWithProductData(List<OrderDTO> orderDTOs) {
        for (OrderDTO orderDTO : orderDTOs) {
            enrichSingleOrderDTO(orderDTO);
        }
    }

    private void enrichSingleOrderDTO(OrderDTO orderDTO) {
        Order order = orderRepository.findById(orderDTO.getOrderId()).orElse(null);
        if (order == null)
            return;

        // Map order items to a list for indexed access if needed, or iterate
        // The original logic relied on index matching between DTO list and Entity list
        List<OrderItemDTO> itemDTOs = orderDTO.getOrderItems();
        List<OrderItem> itemEntities = order.getOrderItems();

        if (itemDTOs.size() != itemEntities.size()) {
            log.warn("Order item count mismatch for order {}", orderDTO.getOrderId());
            return;
        }

        for (int i = 0; i < itemDTOs.size(); i++) {
            enrichOrderItem(itemDTOs.get(i), itemEntities.get(i));
        }
    }

    private void enrichOrderItem(OrderItemDTO itemDTO, OrderItem itemEntity) {
        try {
            if (itemEntity.getProductId() != null) {
                ProductDTO productDTO = productServiceClient.getProductById(itemEntity.getProductId()).getBody();
                itemDTO.setProduct(productDTO);
            }

            if (itemEntity.getProductVariantId() != null) {
                ProductVariantDTO variantDTO = productServiceClient
                        .getProductVariantById(itemEntity.getProductId(), itemEntity.getProductVariantId())
                        .getBody();
                itemDTO.setProductVariant(variantDTO);
            }
        } catch (Exception e) {
            log.error("Failed to fetch product/variant data for orderItem {}: {}", itemEntity.getOrderItemId(),
                    e.getMessage());
        }
    }
}
