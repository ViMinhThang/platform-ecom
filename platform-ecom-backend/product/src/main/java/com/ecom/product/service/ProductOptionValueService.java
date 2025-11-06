package com.ecom.product.service;

import com.ecom.product.dto.ProductOptionValueDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductOptionValueService {

    ProductOptionValueDTO createProductOptionValue(@Valid ProductOptionValueDTO productOptionValueDTO);

    List<ProductOptionValueDTO> getValuesForOption(Long optionId);

    ProductOptionValueDTO getProductOptionValueById(Long valueId);

    ProductOptionValueDTO updateProductOptionValue(Long valueId, @Valid ProductOptionValueDTO productOptionValueDTO);

    void deleteProductOptionValue(Long valueId);
}
