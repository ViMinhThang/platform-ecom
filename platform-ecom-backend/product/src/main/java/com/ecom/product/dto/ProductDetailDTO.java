package com.ecom.product.dto;

import com.ecom.product.entity.ProductImage;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProductDetailDTO extends ProductDTO {
    private List<ProductOptionDTO> options;
    private List<ProductVariantDTO> variants;
    private List<ProductImageDTO> images;
}
