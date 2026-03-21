package com.ecom.order.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.order.dto.DashboardOverviewDTO;
import com.ecom.order.dto.MonthlyOrdersDTO;
import com.ecom.order.dto.MonthlyRevenueDTO;
import com.ecom.order.dto.RecentOrderDTO;
import com.ecom.order.service.signature.AdminAnalyticsService;
import com.ecom.common.util.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<APIResponse<DashboardOverviewDTO>> getOverview(
            @RequestParam(required = false) Integer year,
            jakarta.servlet.http.HttpServletRequest request) {
        Long sellerId = extractUserId(request);
        int targetYear = year != null ? year : Year.now().getValue();
        return ResponseBuilder.success("Dashboard overview retrieved successfully",
                analyticsService.getDashboardOverview(sellerId, targetYear));
    }

    @GetMapping("/revenue-by-month")
    public ResponseEntity<APIResponse<List<MonthlyRevenueDTO>>> getRevenueByMonth(
            @RequestParam(required = false) Integer year,
            jakarta.servlet.http.HttpServletRequest request) {
        Long sellerId = extractUserId(request);
        int targetYear = year != null ? year : Year.now().getValue();
        return ResponseBuilder.success("Monthly revenue data retrieved successfully",
                analyticsService.getRevenueByMonth(sellerId, targetYear));
    }

    @GetMapping("/orders-by-month")
    public ResponseEntity<APIResponse<List<MonthlyOrdersDTO>>> getOrdersByMonth(
            @RequestParam(required = false) Integer year,
            jakarta.servlet.http.HttpServletRequest request) {
        Long sellerId = extractUserId(request);
        int targetYear = year != null ? year : Year.now().getValue();
        return ResponseBuilder.success("Monthly orders data retrieved successfully",
                analyticsService.getOrdersByMonth(sellerId, targetYear));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<APIResponse<List<RecentOrderDTO>>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit,
            jakarta.servlet.http.HttpServletRequest request) {
        Long sellerId = extractUserId(request);
        return ResponseBuilder.success("Recent orders retrieved successfully",
                analyticsService.getRecentOrders(sellerId, limit));
    }

    private Long extractUserId(jakarta.servlet.http.HttpServletRequest request) {
        Object userIdAttr = request.getAttribute("userId");
        if (userIdAttr == null) {
            throw new IllegalStateException("User ID not found in request");
        }
        return Long.valueOf(userIdAttr.toString());
    }
}
