package com.ecom.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummaryDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String categoryName;
    private BigDecimal price;
    private Double averageRating;
    private Long totalSold;
    private String imageUrl;
    private Double similarityScore;
}
