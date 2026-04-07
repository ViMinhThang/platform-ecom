package com.ecom.order.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.order.dto.*;
import com.ecom.order.service.signature.OrderGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.ecom.common.util.ResponseBuilder;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderGroupService orderGroupService;

    @GetMapping
    public ResponseEntity<APIResponse<Page<AdminOrderGroupDTO>>> getAllOrders(OrderFilterRequest filter) {
        return ResponseBuilder.success("Orders retrieved successfully", orderGroupService.getAllOrdersAdmin(filter));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<APIResponse<AdminOrderGroupDTO>> getOrderDetails(@PathVariable Long groupId) {
        return ResponseBuilder.success("Order details retrieved successfully",
                orderGroupService.getOrderDetailsAdmin(groupId));
    }

    @GetMapping("/user/{email}/verify-purchase")
    public ResponseEntity<APIResponse<Boolean>> verifyPurchase(
            @PathVariable String email,
            @RequestParam Long productId) {
        boolean hasPurchased = orderGroupService.hasUserPurchasedProduct(email, productId);
        return ResponseBuilder.success("Purchase verification completed", hasPurchased);
    }

    @PutMapping("/{groupId}/status")
    public ResponseEntity<APIResponse<AdminOrderGroupDTO>> updateOrderStatus(
            @PathVariable Long groupId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        return ResponseBuilder.success("Order status updated successfully",
                orderGroupService.updateOrderStatus(groupId, status, notes));
    }

    @PutMapping("/{groupId}/sub-orders/{subOrderId}/status")
    public ResponseEntity<APIResponse<AdminSubOrderDTO>> updateSubOrderStatus(
            @PathVariable Long groupId,
            @PathVariable Long subOrderId,
            @RequestParam String status,
            @RequestParam(required = false) String notes,
            @RequestHeader(value = "X-Admin-Id", required = false) Long adminId) {
        return ResponseBuilder.success("Sub-order status updated successfully",
                orderGroupService.updateSubOrderStatus(groupId, subOrderId, status, adminId, notes));
    }

    @PutMapping("/{groupId}/sub-orders/{subOrderId}/tracking")
    public ResponseEntity<APIResponse<AdminSubOrderDTO>> updateSubOrderTracking(
            @PathVariable Long groupId,
            @PathVariable Long subOrderId,
            @RequestBody TrackingUpdateRequest request) {
        return ResponseBuilder.success("Tracking information updated successfully",
                orderGroupService.updateSubOrderTracking(groupId, subOrderId, request));
    }
}
