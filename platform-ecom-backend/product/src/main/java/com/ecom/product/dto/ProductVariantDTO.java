package com.ecom.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductVariantDTO {
    private Long id;
    private Long productId;
    private String sku;
    private BigDecimal price;
    private Integer stock;
    private Boolean isActive;
    private String imageUrl;
    private Integer totalSold;
    private List<VariantOptionValueDTO> optionValues;
    private Boolean hidden;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
