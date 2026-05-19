package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.VariantOptionValue;
import com.ecom.product.repository.VariantOptionValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VariantOptionValueHelper {

    private final VariantOptionValueRepository variantOptionValueRepository;

    public VariantOptionValue findByIdOrThrow(Long id) {
        return variantOptionValueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VariantOptionValue", "variantOptionValueId", id));
    }
}
