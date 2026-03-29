package com.ecom.order.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.security.AuthContext;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.dto.CheckoutSessionDTO;
import com.ecom.order.dto.ConfirmPaymentRequest;
import com.ecom.order.dto.CreateOrderRequest;
import com.ecom.order.dto.OrderGroupDTO;
import com.ecom.order.service.signature.OrderGroupService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Order Group Controller - Multi-seller order management
 * 
 * Checkout Flow:
 * 1. POST /initiate-checkout - Validates cart, creates Stripe PaymentIntent (no order yet)
 * 2. Frontend completes payment with Stripe
 * 3. POST /confirm-payment - Verifies payment, creates order with PAID status
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/order-groups")
@RequiredArgsConstructor
public class OrderGroupController {

    private final OrderGroupService orderGroupService;
    private final AuthContext authContext;

    /**
     * Step 1: Initiate checkout - creates Stripe PaymentIntent
     * No order is created at this step
     */
    @PostMapping("/initiate-checkout")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<CheckoutSessionDTO>> initiateCheckout(
            @Valid @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        log.info("Initiating checkout for user {} with payment provider {}",
                userId, request.getPaymentProvider());

        CheckoutSessionDTO session = orderGroupService.initiateCheckout(userId, request);

        return ResponseEntity.ok(ResponseBuilder.success("Checkout initiated", session).getBody());
    }

    /**
     * Step 2: Confirm payment and create order
     * Called after Stripe payment succeeds on frontend
     */
    @PostMapping("/confirm-payment")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<OrderGroupDTO>> confirmPayment(
            @Valid @RequestBody ConfirmPaymentRequest request,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        log.info("Confirming payment {} for user {}", request.getPaymentIntentId(), userId);

        OrderGroupDTO orderGroup = orderGroupService.confirmPaymentAndCreateOrder(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseBuilder.success("Order created successfully", orderGroup).getBody());
    }

    /**
     * Get user's order groups (order history)
     */
    @GetMapping
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<Page<OrderGroupDTO>>> getOrderGroups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        Long userId = extractUserId(request);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderGroupDTO> orders = orderGroupService.getUserOrderGroups(userId, pageable);

        return ResponseBuilder.success("Orders retrieved", orders);
    }

    /**
     * Get specific order group by ID
     */
    @GetMapping("/{groupId}")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<OrderGroupDTO>> getOrderGroup(
            @PathVariable Long groupId,
            HttpServletRequest request) {

        Long userId = extractUserId(request);
        OrderGroupDTO orderGroup = orderGroupService.getOrderGroup(groupId, userId);

        return ResponseBuilder.success("Order retrieved", orderGroup);
    }

    /**
     * Cancel order group (only if not shipped)
     */
    @PostMapping("/{groupId}/cancel")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<Void>> cancelOrderGroup(
            @PathVariable Long groupId,
            HttpServletRequest request) {

        Long userId = extractUserId(request);

        log.info("User {} requesting to cancel order group {}", userId, groupId);
        orderGroupService.cancelOrderGroup(groupId, userId);

        return ResponseBuilder.success("Order cancelled", null);
    }

    /**
     * Get payment status for order group
     */
    @GetMapping("/{groupId}/payment-status")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<String>> getPaymentStatus(
            @PathVariable Long groupId,
            HttpServletRequest request) {

        Long userId = extractUserId(request);
        OrderGroupDTO orderGroup = orderGroupService.getOrderGroup(groupId, userId);

        return ResponseBuilder.success("Payment status retrieved",
                orderGroup.getPaymentStatus().toString());
    }

    /**
     * Extract user ID from request
     */
    private Long extractUserId(HttpServletRequest request) {
        Object userIdAttr = authContext.getUserId(request);
        if (userIdAttr == null) {
            throw new IllegalStateException("Không tìm thấy ID người dùng trong yêu cầu");
        }
        return Long.valueOf(userIdAttr.toString());
    }
}
