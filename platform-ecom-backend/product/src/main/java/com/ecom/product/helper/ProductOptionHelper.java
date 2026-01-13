package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.ProductOption;
import com.ecom.product.repository.ProductOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductOptionHelper {

    private final ProductOptionRepository productOptionRepository;

    public ProductOption findByIdOrThrow(Long id) {
        return productOptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductOption", "optionId", id));
    }
}
