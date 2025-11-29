package com.ecom.order.controller;

import com.ecom.order.aspect.RequireRole;
import com.ecom.order.client.UserServiceClient;
import com.ecom.order.config.AppConstants;
import com.ecom.order.config.AuthContext;
import com.ecom.order.dtos.*;
import com.ecom.order.service.OrderService;
import com.ecom.order.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthContext authContext;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private UserServiceClient userServiceClient;

    @PostMapping("/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod,
            @RequestBody OrderRequestDTO orderRequestDTO,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        System.out.println("orderRequestDTO DATA: " + orderRequestDTO);
        OrderDTO order = orderService.placeOrder(
                userId,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage());
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @PostMapping("/stripe-client-secret")
    public ResponseEntity<String> createStripeClientSecret(@RequestBody StripePaymentDto stripePaymentDto)
            throws StripeException, StripeException {
        System.out.println("StripePaymentDTO Received " + stripePaymentDto);
        PaymentIntent paymentIntent = stripeService.paymentIntent(stripePaymentDto);
        return new ResponseEntity<>(paymentIntent.getClientSecret(), HttpStatus.CREATED);
    }

    @GetMapping("/admin/orders")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }

    @GetMapping("/seller/orders")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<OrderResponse> getAllSellerOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        OrderResponse orderResponse = orderService.getAllSellerOrders(pageNumber, pageSize, sortBy, sortOrder, userId);
        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
            @RequestBody OrderStatusUpdateDTO orderStatusUpdateDto) {
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
    }

    @PutMapping("/seller/orders/{orderId}/status")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<OrderDTO> updateOrderStatusSeller(@PathVariable Long orderId,
            @RequestBody OrderStatusUpdateDTO orderStatusUpdateDto) {
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
        return new ResponseEntity<OrderDTO>(order, HttpStatus.OK);
    }

    @GetMapping("/count-orders")
    public ResponseEntity<Long> getOrdersCount() {
        Long count = orderService.getOrdersCount();
        return new ResponseEntity<Long>(count, HttpStatus.OK);
    }

    @GetMapping("/order-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        Double totalRevenue = orderService.getTotalRevenue();
        return new ResponseEntity<Double>(totalRevenue, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/user/{email}/verify-purchase")
    public ResponseEntity<Boolean> verifyPurchase(
            @PathVariable String email,
            @RequestParam("productId") Long productId) {
        Boolean hasPurchased = orderService.verifyUserPurchase(email, productId);
        return ResponseEntity.ok(hasPurchased);
    }

    @GetMapping("/user/history")
    public ResponseEntity<OrderResponse> getUserOrderHistory(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        // Get user email from user service
        String email = userServiceClient.getEmailById(userId);

        OrderResponse orderResponse = orderService.getUserOrders(email, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }
}
