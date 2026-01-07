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
public class SaleCampaignItemDTO {
    private Long id;
    private Long variantId;
    private Long productId;
    private String productName;
    private String productSlug;
    private String variantSku;
    private String imageUrl;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer discountPercent;
    private Integer stockLimit;
    private Integer soldCount;
    private Integer remainingStock;
    private Integer sortOrder;
    private Boolean isAvailable;
}
