package com.ecom.product.helper;

import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.entity.Product;
import com.ecom.product.enums.ProductStatus;
import com.ecom.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductHelper {

    private final ProductRepository productRepository;

    public Product findByIdOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", id));
    }

    public Product findBySlugOrThrow(String slug) {
        return productRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
    }

    public void validateProductIsActive(Product product) {
        if (!ProductStatus.ACTIVE.getValue().equals(product.getStatus()) || Boolean.TRUE.equals(product.getDeleted())) {
            throw new ResourceNotFoundException("Product", "ProductId", product.getId());
        }
    }
}
