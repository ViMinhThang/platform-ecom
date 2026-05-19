package com.ecom.product.service.signature;

import com.ecom.product.dto.VariantOptionValueDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface VariantOptionValueService {

    VariantOptionValueDTO createVariantOptionValue(@Valid VariantOptionValueDTO variantOptionValueDTO);

    List<VariantOptionValueDTO> getValuesForVariant(Long variantId);

    void deleteVariantOptionValue(Long variantOptionValueId);
}
