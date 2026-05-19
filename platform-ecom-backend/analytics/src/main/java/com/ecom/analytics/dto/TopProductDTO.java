package com.ecom.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopProductDTO {
    
    private Long productId;
    private String productName;
    private String productSlug;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    
    private Long views;
    private Long purchases;
    private BigDecimal revenue;
    private Double conversionRate;
    
    // Ranking
    private Integer rank;
    private String sortedBy; // views, revenue, conversion
}
