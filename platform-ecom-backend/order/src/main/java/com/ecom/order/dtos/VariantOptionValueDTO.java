package com.ecom.order.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for variant option values in order items
 * Contains information about product variant options (color, size, etc.)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariantOptionValueDTO {
    private Long id;
    private Long variantId;
    private Long optionId;
    private ProductOptionValueDTO productOptionValue;
    private BigDecimal priceModifier;
}
