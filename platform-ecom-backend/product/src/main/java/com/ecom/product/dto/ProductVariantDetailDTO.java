package com.ecom.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDetailDTO {
    private Long productId;
    private String name;
    private String imageUrl;
    private Long sellerId;
    private String sellerName;
    private String variantName;
    private BigDecimal price;
    private Integer stockQuantity;
}
