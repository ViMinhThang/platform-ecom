package com.ecom.order.controller;

import com.ecom.common.aspect.RequireRole;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.order.dto.SubOrderDTO;
import com.ecom.order.service.signature.SubOrderService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Sub-Order Controller - Seller-specific order operations
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/sub-orders")
@RequiredArgsConstructor
public class SubOrderController {

    private final SubOrderService subOrderService;

    /**
     * Get sub-order details
     */
    @GetMapping("/{subOrderId}")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<SubOrderDTO>> getSubOrder(
            @PathVariable Long subOrderId,
            HttpServletRequest request) {

        Long userId = extractUserId(request);
        SubOrderDTO subOrder = subOrderService.getSubOrder(subOrderId, userId);

        return ResponseBuilder.success("Sub-order retrieved", subOrder);
    }

    /**
     * Get seller's sub-orders (for seller dashboard)
     */
    @GetMapping("/seller")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<Page<SubOrderDTO>>> getSellerSubOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            HttpServletRequest request) {

        Long sellerId = extractUserId(request);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<SubOrderDTO> subOrders = subOrderService.getSellerSubOrders(sellerId, status, pageable);

        return ResponseBuilder.success("Sub-orders retrieved", subOrders);
    }

    /**
     * Update tracking information (seller only)
     */
    @PutMapping("/{subOrderId}/tracking")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<SubOrderDTO>> updateTracking(
            @PathVariable Long subOrderId,
            @RequestParam String trackingNumber,
            @RequestParam(required = false) String carrier,
            @RequestParam(required = false) String trackingUrl,
            HttpServletRequest request) {

        Long sellerId = extractUserId(request);

        log.info("Seller {} updating tracking for sub-order {}", sellerId, subOrderId);

        SubOrderDTO subOrder = subOrderService.updateTracking(
                subOrderId, sellerId, trackingNumber, carrier, trackingUrl);

        return ResponseBuilder.success("Tracking updated", subOrder);
    }

    /**
     * Mark sub-order as shipped (seller only)
     */
    @PostMapping("/{subOrderId}/ship")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<SubOrderDTO>> markAsShipped(
            @PathVariable Long subOrderId,
            HttpServletRequest request) {

        Long sellerId = extractUserId(request);

        log.info("Seller {} marking sub-order {} as shipped", sellerId, subOrderId);

        SubOrderDTO subOrder = subOrderService.markAsShipped(subOrderId, sellerId);

        return ResponseBuilder.success("Sub-order marked as shipped", subOrder);
    }

    /**
     * Mark sub-order as delivered
     */
    @PostMapping("/{subOrderId}/deliver")
    @RequireRole("ROLE_SELLER")
    public ResponseEntity<APIResponse<SubOrderDTO>> markAsDelivered(
            @PathVariable Long subOrderId,
            HttpServletRequest request) {

        Long sellerId = extractUserId(request);

        log.info("Seller {} marking sub-order {} as delivered", sellerId, subOrderId);

        SubOrderDTO subOrder = subOrderService.markAsDelivered(subOrderId, sellerId);

        return ResponseBuilder.success("Sub-order marked as delivered", subOrder);
    }

    /**
     * Cancel sub-order
     */
    @PostMapping("/{subOrderId}/cancel")
    @RequireRole("ROLE_USER")
    public ResponseEntity<APIResponse<Void>> cancelSubOrder(
            @PathVariable Long subOrderId,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {

        Long userId = extractUserId(request);

        log.info("User {} requesting to cancel sub-order {}", userId, subOrderId);

        subOrderService.cancelSubOrder(subOrderId, userId, reason);

        return ResponseBuilder.success("Sub-order cancelled", null);
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
