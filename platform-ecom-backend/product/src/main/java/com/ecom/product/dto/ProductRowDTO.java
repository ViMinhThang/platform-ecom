package com.ecom.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRowDTO {
    private Long id;
    private String name;
    private CategoryDTO category;
    private String imageUrl;
    private String status;
    private BigDecimal minPrice;
    private Integer variants;
    private ProductVariantDTO firstVariant;
    private Long totalSold;
    private Long totalReviews;
    private Double averageRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String slug;
}
