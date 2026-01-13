package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.DescriptionImage;
import com.ecom.product.repository.DescriptionImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DescriptionImageHelper {

    private final DescriptionImageRepository descriptionImageRepository;

    public DescriptionImage findByProductIdAndIdOrThrow(Long productId, Long imageId) {
        return descriptionImageRepository.findByProductIdAndId(productId, imageId)
                .orElseThrow(() -> new ResourceNotFoundException("DescriptionImage", "id", imageId));
    }
}
