package com.ecom.analytics.service.impl;

import com.ecom.analytics.dto.ProductPerformanceDTO;
import com.ecom.analytics.dto.SellerOverviewDTO;
import com.ecom.analytics.dto.TopProductDTO;
import com.ecom.analytics.entity.ProductAnalytics;
import com.ecom.analytics.repository.ProductAnalyticsRepository;
import com.ecom.analytics.repository.DailyProductStatsRepository;
import com.ecom.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProductAnalyticsRepository productAnalyticsRepository;
    private final DailyProductStatsRepository dailyProductStatsRepository;
    private final ModelMapper modelMapper;

    @Override
    public SellerOverviewDTO getSellerOverview(Long sellerId, String period) {
        return SellerOverviewDTO.builder()
                .sellerId(sellerId)
                .period(period)
                .build();
    }

    @Override
    public ProductPerformanceDTO getProductPerformance(Long productId) {
        ProductAnalytics analytics = productAnalyticsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Analytics not found for product: " + productId));

        return modelMapper.map(analytics, ProductPerformanceDTO.class);
    }

    @Override
    public List<ProductPerformanceDTO> getTopProducts(Long sellerId, String sortBy, int limit) {
        List<ProductAnalytics> topProducts = productAnalyticsRepository.findBySellerId(sellerId);
        return topProducts.stream()
                .limit(limit)
                .map(p -> modelMapper.map(p, ProductPerformanceDTO.class))
                .collect(Collectors.toList());
    }
}
