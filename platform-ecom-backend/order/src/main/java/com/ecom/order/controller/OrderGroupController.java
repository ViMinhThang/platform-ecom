package com.ecom.order.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
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
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/order-groups")
@RequiredArgsConstructor
public class OrderGroupController {

    private final OrderGroupService orderGroupService;

    /**
     * Create order group from cart (checkout)
     */
    @PostMapping
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<OrderGroupDTO>> createOrderGroup(
            @Valid @RequestBody CreateOrderRequest request,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        log.info("Creating order group for user {} with payment provider {}",
                userId, request.getPaymentProvider());

        OrderGroupDTO orderGroup = orderGroupService.createFromCart(userId, request);

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
     * Cancel order group (only if payment not completed)
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
        Object userIdAttr = request.getAttribute("userId");
        if (userIdAttr == null) {
            throw new IllegalStateException("User ID not found in request");
        }
        return Long.valueOf(userIdAttr.toString());
    }
}
