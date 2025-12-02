package com.ecom.order.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Client for communicating with Product Service
 * TODO: Implement using RestTemplate or WebClient
 */
@Component
public class ProductServiceClient {

    /**
     * Get product price
     */
    public BigDecimal getProductPrice(Long productId, Long variantId) {
        // TODO: Call product service API
        // For now, return placeholder
        return BigDecimal.valueOf(99.99);
    }

    /**
     * Get product details
     */
    public ProductDetails getProductDetails(Long productId, Long variantId) {
        // TODO: Call product service API
        // For now, return placeholder
        return ProductDetails.builder()
                .productId(productId)
                .name("Product " + productId)
                .imageUrl("https://placeholder.com/image.jpg")
                .sellerId(1L)
                .sellerName("Seller 1")
                .price(BigDecimal.valueOf(99.99))
                .stockQuantity(100)
                .build();
    }

    /**
     * Validate stock availability
     */
    public boolean validateStock(Long productId, Long variantId, Integer quantity) {
        // TODO: Call product service API
        return true;
    }
}
