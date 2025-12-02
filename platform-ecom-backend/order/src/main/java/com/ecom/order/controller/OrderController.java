package com.ecom.order.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.order.client.UserServiceClient;

import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.PaginationRequest;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.dtos.*;
import com.ecom.order.service.OrderService;
import com.ecom.order.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthContext authContext;
    private final StripeService stripeService;
    private final UserServiceClient userServiceClient;

    @PostMapping("/users/payments/{paymentMethod}")
    public ResponseEntity<APIResponse<OrderDTO>> orderProducts(@PathVariable String paymentMethod,
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
        return ResponseBuilder.createdWithMessage("Order placed successfully", order);
    }

    @PostMapping("/stripe-client-secret")
    public ResponseEntity<APIResponse<String>> createStripeClientSecret(@RequestBody StripePaymentDto stripePaymentDto)
            throws StripeException, StripeException {
        System.out.println("StripePaymentDTO Received " + stripePaymentDto);
        PaymentIntent paymentIntent = stripeService.paymentIntent(stripePaymentDto);
        return ResponseBuilder.createdWithMessage("Stripe client secret created successfully",
                paymentIntent.getClientSecret());
    }

    @GetMapping("/admin/orders")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<OrderResponse>> getAllOrders(PaginationRequest paginationRequest) {
        OrderResponse orderResponse = orderService.getAllOrders(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("Orders retrieved successfully", orderResponse);
    }

    @GetMapping("/seller/orders")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<OrderResponse>> getAllSellerOrders(
            PaginationRequest paginationRequest,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);
        OrderResponse orderResponse = orderService.getAllSellerOrders(
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder(),
                userId);
        return ResponseBuilder.success("Seller orders retrieved successfully", orderResponse);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    @RequireRole("ROLE_ADMIN")
    public ResponseEntity<APIResponse<OrderDTO>> updateOrderStatus(@PathVariable Long orderId,
            @RequestBody OrderStatusUpdateDTO orderStatusUpdateDto) {
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
        return ResponseBuilder.success("Order status updated successfully", order);
    }

    @PutMapping("/seller/orders/{orderId}/status")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<OrderDTO>> updateOrderStatusSeller(@PathVariable Long orderId,
            @RequestBody OrderStatusUpdateDTO orderStatusUpdateDto) {
        OrderDTO order = orderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
        return ResponseBuilder.success("Order status updated successfully", order);
    }

    @GetMapping("/count-orders")
    public ResponseEntity<APIResponse<Long>> getOrdersCount() {
        Long count = orderService.getOrdersCount();
        return ResponseBuilder.success("Orders count retrieved successfully", count);
    }

    @GetMapping("/order-revenue")
    public ResponseEntity<APIResponse<Double>> getTotalRevenue() {
        Double totalRevenue = orderService.getTotalRevenue();
        return ResponseBuilder.success("Total revenue retrieved successfully", totalRevenue);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<APIResponse<OrderDTO>> getOrderById(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return ResponseBuilder.success("Order retrieved successfully", order);
    }

    @GetMapping("/user/{email}/verify-purchase")
    public ResponseEntity<APIResponse<Boolean>> verifyPurchase(
            @PathVariable String email,
            @RequestParam("productId") Long productId) {
        Boolean hasPurchased = orderService.verifyUserPurchase(email, productId);
        return ResponseBuilder.success("Purchase verification retrieved successfully", hasPurchased);
    }

    @GetMapping("/user/history")
    public ResponseEntity<APIResponse<OrderResponse>> getUserOrderHistory(
            PaginationRequest paginationRequest,
            HttpServletRequest request) {
        Long userId = authContext.getUserId(request);

        // Get user email from user service
        String email = userServiceClient.getEmailById(userId);

        OrderResponse orderResponse = orderService.getUserOrders(
                email,
                paginationRequest.getPageNumber(),
                paginationRequest.getPageSize(),
                paginationRequest.getSortBy(),
                paginationRequest.getSortOrder());
        return ResponseBuilder.success("User order history retrieved successfully", orderResponse);
    }
}
