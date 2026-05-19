package com.ecom.product.service.signature;

import com.ecom.product.dto.ProductOptionDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductOptionService {

    ProductOptionDTO createProductOption(@Valid ProductOptionDTO productOptionDTO,Long productId);

    List<ProductOptionDTO> getAllProductOptions();

    List<ProductOptionDTO> getProductOptionById(Long productId);

    ProductOptionDTO updateProductOption(ProductOptionDTO dto, Long productId,Long optionId);

    void deleteProductOption(Long optionId,Long productId);
}
