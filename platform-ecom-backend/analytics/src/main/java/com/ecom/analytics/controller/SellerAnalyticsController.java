package com.ecom.analytics.controller;

import com.ecom.analytics.dto.ProductPerformanceDTO;
import com.ecom.analytics.dto.SellerOverviewDTO;
import com.ecom.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics/sellers")
public class SellerAnalyticsController {

    private final AnalyticsService analyticsService;

    public SellerAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{sellerId}/overview")
    public ResponseEntity<SellerOverviewDTO> getOverview(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "7d") String period) {
        return ResponseEntity.ok(analyticsService.getSellerOverview(sellerId, period));
    }

    @GetMapping("/products/{productId}/performance")
    public ResponseEntity<ProductPerformanceDTO> getProductPerformance(@PathVariable Long productId) {
        return ResponseEntity.ok(analyticsService.getProductPerformance(productId));
    }

    @GetMapping("/{sellerId}/products/top")
    public ResponseEntity<List<ProductPerformanceDTO>> getTopProducts(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "views") String sortBy,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopProducts(sellerId, sortBy, limit));
    }
}
