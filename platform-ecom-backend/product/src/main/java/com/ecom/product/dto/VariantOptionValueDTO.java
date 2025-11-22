package com.ecom.product.dto;

import com.ecom.product.entity.ProductOptionValue;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VariantOptionValueDTO {
    private Long id;
    private Long variantId;
    private Long optionId;
    private ProductOptionValueDTO productOptionValue;
    private BigDecimal priceModifier;
}
