package com.ecom.chatbot.client;

import com.ecom.chatbot.dto.ProductDTO;
import com.ecom.chatbot.dto.ProductResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface ProductServiceClient {

        @GetExchange("/products/{id}")
        ApiResponseWrapper<ProductDTO> getProductById(@PathVariable("id") Long id);

        @GetExchange("/products/slug/{slug}")
        ApiResponseWrapper<ProductDTO> getProductBySlug(@PathVariable("slug") String slug);

        @GetExchange("/products")
        ApiResponseWrapper<ProductResponse> getAllPublicProducts(
                        @RequestParam(value = "pageNumber", required = false) Integer page,
                        @RequestParam(value = "pageSize", required = false) Integer perPage);

        @GetExchange("/products")
        ApiResponseWrapper<ProductResponse> searchProducts(
                        @RequestParam(value = "search", required = false) String search,
                        @RequestParam(value = "pageNumber", required = false) Integer page,
                        @RequestParam(value = "pageSize", required = false) Integer perPage);
}
