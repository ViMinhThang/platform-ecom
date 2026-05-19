package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.ProductImage;
import com.ecom.product.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductImageHelper {

    private final ProductImageRepository productImageRepository;

    public ProductImage findByProductIdAndIdOrThrow(Long productId, Long imageId) {
        return productImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductImage", "imageId", imageId));
    }
}
