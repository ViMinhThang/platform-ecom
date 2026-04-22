package com.ecom.chatbot.client;

import com.ecom.chatbot.client.ApiResponseWrapper;
import com.ecom.chatbot.dto.ProductSummaryDTO;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.math.BigDecimal;
import java.util.List;

@HttpExchange("/api/v1/internal/embeddings")
public interface EmbeddingServiceClient {

    @PostExchange("/search")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchSimilarProducts(
            @RequestParam("query") String query,
            @RequestParam("limit") int limit);

    @PostExchange("/search-with-price")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchSimilarProductsWithPriceRange(
            @RequestParam("query") String query,
            @RequestParam("minPrice") BigDecimal minPrice,
            @RequestParam("maxPrice") BigDecimal maxPrice,
            @RequestParam("limit") int limit);

    @PostExchange("/sync")
    ApiResponseWrapper<Void> syncEmbeddings();

    @GetExchange("/stats")
    ApiResponseWrapper<Object> getEmbeddingStats();

    @GetExchange("/{productId}")
    ApiResponseWrapper<Object> hasEmbedding(@PathVariable("productId") Long productId);

    @PostExchange("/price-range")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchByPriceRange(
            @RequestParam("minPrice") BigDecimal minPrice,
            @RequestParam("maxPrice") BigDecimal maxPrice,
            @RequestParam("limit") int limit);

    @PostExchange("/brand")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchByBrand(
            @RequestParam("brand") String brand,
            @RequestParam("limit") int limit);

    @PostExchange("/sort")
    ApiResponseWrapper<List<ProductSummaryDTO>> searchWithSorting(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam("sortBy") String sortBy,
            @RequestParam("sortDirection") String sortDirection,
            @RequestParam("limit") int limit);
}
