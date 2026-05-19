package com.ecom.chatbot.service.signature;

import com.ecom.chatbot.dto.ProductSummaryDTO;

import java.math.BigDecimal;
import java.util.List;

public interface EmbeddingService {

    void syncProductEmbeddings();

    List<ProductSummaryDTO> findSimilarProducts(String query, int limit);

    List<ProductSummaryDTO> findProductsWithSorting(String keyword, String sortBy, String sortDirection, int limit);

    void updateProductEmbedding(Object product);

    long getEmbeddingCount();

    boolean hasEmbedding(Long productId);

    String generateQueryVector(String query);

    List<ProductSummaryDTO> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int limit);

    List<ProductSummaryDTO> findByBrand(String brand, int limit);

    List<ProductSummaryDTO> findSimilarProductsWithPriceRange(String query, BigDecimal minPrice, BigDecimal maxPrice, int limit);
}
