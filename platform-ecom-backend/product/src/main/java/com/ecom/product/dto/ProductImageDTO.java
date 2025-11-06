package com.ecom.product.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ProductImageDTO {
    private Long id;
    private Long productId;
    private String imageUrl;
    private Boolean isPrimary;
    private Integer sortOrder;
    private Map<String, Object> metadata;
    private LocalDateTime createdAt;
}
