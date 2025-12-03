package com.ecom.product.service.signature;

import com.ecom.product.dto.*;
import jakarta.validation.Valid;

import java.math.BigDecimal;

public interface ProductService {

    ProductRowDTO createProduct(@Valid ProductDTO productDTO, Long userId);

    ProductDTO getProductById(Long productId);

    ProductDTO updateProduct(Long productId, @Valid ProductDTO productDTO);

    ProductDTO deleteProduct(Long productId);

    ProductResponse getAllProductsForSeller(Integer page, Integer perPage, String name, String category, String sortBy,
            String sortOrder, Long userId);

    ProductResponse getAllPublicProducts(Integer page, Integer perPage, String category, String search, String sortBy,
            String sortOrder, BigDecimal minPrice, BigDecimal maxPrice, Double minRating);

    ProductDTO getPublicProductById(Long productId);

    ProductDetailDTO getProductWithVariants(Long productId);

    ProductVariantDTO getVariantById(Long variantId);
}
