package com.ecom.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private CategoryDTO cate;
    private String status;
    private BigDecimal minPrice;
    private Map<String, Object> specifications;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long totalSold;
    private Long totalReviews;
    private Double averageRating;
}
