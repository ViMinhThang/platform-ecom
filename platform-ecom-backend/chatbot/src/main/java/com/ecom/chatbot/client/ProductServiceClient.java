package com.ecom.chatbot.client;

import com.ecom.chatbot.dto.ProductDTO;
import com.ecom.chatbot.dto.ProductResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

/**
 * HTTP client interface for Product service communication.
 * Note: Product service wraps responses in APIResponse, so we need wrapper
 * DTOs.
 */
public interface ProductServiceClient {

        /**
         * Get product by ID
         */
        @GetExchange("/products/{id}")
        ApiResponseWrapper<ProductDTO> getProductById(@PathVariable("id") Long id);

        /**
         * Get product by slug
         */
        @GetExchange("/products/slug/{slug}")
        ApiResponseWrapper<ProductDTO> getProductBySlug(@PathVariable("slug") String slug);

        /**
         * Get all public products with pagination
         * The actual endpoint is GET /products (not /products/public)
         */
        @GetExchange("/products")
        ApiResponseWrapper<ProductResponse> getAllPublicProducts(
                        @RequestParam(value = "pageNumber", required = false) Integer page,
                        @RequestParam(value = "pageSize", required = false) Integer perPage);

        /**
         * Search products by query
         */
        @GetExchange("/products")
        ApiResponseWrapper<ProductResponse> searchProducts(
                        @RequestParam(value = "search", required = false) String search,
                        @RequestParam(value = "pageNumber", required = false) Integer page,
                        @RequestParam(value = "pageSize", required = false) Integer perPage);
}
