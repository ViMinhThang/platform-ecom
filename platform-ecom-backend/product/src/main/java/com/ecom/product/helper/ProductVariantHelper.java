package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductVariantHelper {

    private final ProductVariantRepository productVariantRepository;

    public ProductVariant findByIdOrThrow(Long id) {
        return productVariantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", id));
    }

    public ProductVariant findByProductIdAndIdOrThrow(Long productId, Long variantId) {
        return productVariantRepository.findByProductIdAndId(productId, variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "variantId", variantId));
    }
}
