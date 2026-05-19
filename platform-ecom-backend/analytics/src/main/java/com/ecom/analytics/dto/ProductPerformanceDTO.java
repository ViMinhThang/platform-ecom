package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPerformanceDTO {
    
    private Long productId;
    private String productName;
    private String productSlug;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    
    // View metrics
    private Long totalViews;
    private Long uniqueViewers;
    private Long avgViewDurationMs;
    
    // Conversion funnel
    private Long totalClicks;
    private Long totalCartAdds;
    private Long totalPurchases;
    
    // Rates
    private Double clickThroughRate;
    private Double cartRate;
    private Double conversionRate;
    private Double cartAbandonmentRate;
    
    // Revenue
    private BigDecimal totalRevenue;
    private BigDecimal avgOrderValue;
    
    // Recommendations
    private Long recommendationImpressions;
    private Long recommendationClicks;
    private Double recommendationCtr;
    
    // Search
    private Long searchImpressions;
    private Long searchClicks;
    private Double searchCtr;
    
    // Time info
    private LocalDateTime lastViewed;
    private LocalDateTime lastPurchased;
}
