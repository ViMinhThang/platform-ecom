package com.ecom.product.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProductDetailDTO extends ProductDTO {
    private List<ProductOptionDTO> options;
    private List<ProductVariantDTO> variants;
}
