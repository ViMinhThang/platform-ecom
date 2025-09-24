package com.ecom.order.service;

import com.ecom.order.client.ProductServiceClient;
import com.ecom.order.client.UserServiceClient;
import com.ecom.order.dtos.*;
import com.ecom.order.entity.*;
import com.ecom.order.exception.ResourceNotFoundException;
import com.ecom.order.repositories.CartRepository;
import com.ecom.order.repositories.OrderItemRepository;
import com.ecom.order.repositories.OrderRepository;
import com.ecom.order.repositories.PaymentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    CartService cartService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    ProductServiceClient productServiceClient;

    @Autowired
    UserServiceClient userServiceClient;

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Order> pageOrders = orderRepository.findAll(pageDetails);
        List<Order> orders = pageOrders.getContent();
        List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .toList();
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());
        return orderResponse;
    }


    @Override
    public OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, Long sellerId) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        List<Long> sellerProductIds = productServiceClient.getProductsBySellerId(sellerId)
                .getBody()
                .stream()
                .map(ProductDTO::getProductId)
                .toList();

        if (sellerProductIds.isEmpty()) {
            return new OrderResponse();
        }

        Page<Order> pageOrders = orderRepository.findOrdersByProductIds(sellerProductIds, pageDetails);

        // 3. Map sang DTO
        List<OrderDTO> orderDTOs = pageOrders.getContent().stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .toList();

        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());

        return orderResponse;
    }

    @Override
    public OrderDTO updateOrder(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        order.setOrderStatus(status);
        orderRepository.save(order);
        return modelMapper.map(order, OrderDTO.class);
    }

    @Override
    public OrderDTO placeOrder(Long userId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "userId", userId);
        }

        AddressDTO address = userServiceClient.getAddressById(addressId);
        String email = userServiceClient.getEmailById(userId);

        List<Long> productIds = cart.getCartItems()
                .stream()
                .map(CartItem::getProductId)
                .toList();

        Order order = new Order();
        order.setEmail(email);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Accepted");
        order.setAddressId(addressId);


        Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(savedOrder);
            return orderItem;
        }).toList();

        List<ReduceStockDTO> reduceStockDTOS = new ArrayList<>();

        orderItemRepository.saveAll(orderItems)
                .forEach(oi -> reduceStockDTOS.add(new ReduceStockDTO(oi.getProductId(), oi.getQuantity())));


        productServiceClient.reduceStock(reduceStockDTOS);


        cart.getCartItems().forEach(ci -> cartService.deleteProductFromCart(cart.getCartId(), ci.getProductId()));

        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
        orderItems.forEach(item -> orderDTO.getOrderItems().add(modelMapper.map(item, OrderItemDTO.class)));

        orderDTO.setAddressId(addressId);

        return orderDTO;
    }

    @Override
    public Long getOrdersCount() {
        return orderRepository.count();
    }

    @Override
    public Double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }
}
