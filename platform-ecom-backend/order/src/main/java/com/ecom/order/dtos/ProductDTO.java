package com.ecom.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String status;
    private BigDecimal minPrice;
    private Map<String, Object> specifications;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long totalSold;
    private Long totalReviews;
    private Double averageRating;
    private Long userId;
    private Integer quantity;
    private Long variantId;
    private String variantSku;
    private String sellerName;
}
