package com.ecom.analytics.service;

import com.ecom.analytics.dto.ProductPerformanceDTO;
import com.ecom.analytics.dto.SellerOverviewDTO;

import java.util.List;

public interface AnalyticsService {
    SellerOverviewDTO getSellerOverview(Long sellerId, String period);
    ProductPerformanceDTO getProductPerformance(Long productId);
    List<ProductPerformanceDTO> getTopProducts(Long sellerId, String sortBy, int limit);
}
