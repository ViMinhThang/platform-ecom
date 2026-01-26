package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerOverviewDTO {
    
    private Long sellerId;
    private String period; // 7d, 30d, 90d
    
    // Summary metrics
    private Long totalViews;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long totalProducts;
    private Long activeProducts;
    
    // Conversion metrics
    private Double overallConversionRate;
    private Double avgCartRate;
    private Double avgCartAbandonmentRate;
    
    // Comparison with previous period
    private Double viewsChange; // percentage
    private Double ordersChange;
    private Double revenueChange;
    
    // Top performers
    private List<TopProductDTO> topByViews;
    private List<TopProductDTO> topByRevenue;
    private List<TopProductDTO> topByConversion;
    
    // Traffic sources
    private TrafficSourcesDTO trafficSources;
    
    // Daily trends
    private List<DailyTrendDTO> dailyTrends;
}
