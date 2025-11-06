package com.ecom.product.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VariantOptionValueDTO {
    private Long id;
    private Long variantId;
    private Long optionValueId;
    private BigDecimal priceModifier;
}
