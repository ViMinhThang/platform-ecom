package com.ecom.chatbot.client;

import com.ecom.chatbot.client.ApiResponseWrapper;
import com.ecom.common.dto.ProductSummaryDTO;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.math.BigDecimal;
import java.util.List;

@HttpExchange("/api/v1/internal/embeddings")
public interface EmbeddingServiceClient {

    @PostExchange("/search")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchSimilarProducts(
            String query,
            int limit);

    @PostExchange("/search-with-price")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchSimilarProductsWithPriceRange(
            String query,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int limit);

    @PostExchange("/sync")
    ApiResponseWrapper<Void> syncEmbeddings();

    @GetExchange("/stats")
    ApiResponseWrapper<Object> getEmbeddingStats();

    @GetExchange("/{productId}")
    ApiResponseWrapper<Object> hasEmbedding(Long productId);

    @PostExchange("/price-range")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchByPriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int limit);

    @PostExchange("/brand")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchByBrand(
            String brand,
            int limit);

    @PostExchange("/sort")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchWithSorting(
            String keyword,
            String sortBy,
            String sortDirection,
            int limit);
}
