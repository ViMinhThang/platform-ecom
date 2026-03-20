package com.ecom.chatbot.service.impl;

import com.ecom.chatbot.client.EmbeddingServiceClient;
import com.ecom.chatbot.client.ApiResponseWrapper;
import com.ecom.chatbot.dto.ProductSummaryDTO;
import com.ecom.chatbot.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmbeddingServiceImpl implements EmbeddingService {

    private final EmbeddingServiceClient embeddingClient;

    @Override
    public void syncProductEmbeddings() {
        log.info("Triggering product embeddings sync via product-service...");
        try {
            ApiResponseWrapper<Void> response = embeddingClient.syncEmbeddings();
            if (response != null && response.isSuccess()) {
                log.info("Embedding sync triggered successfully");
            } else {
                log.warn("Embedding sync returned unsuccessful response");
            }
        } catch (Exception e) {
            log.error("Failed to trigger embedding sync: {}", e.getMessage(), e);
        }
    }

    @Override
    public List<ProductSummaryDTO> findSimilarProducts(String query, int limit) {
        log.debug("Finding similar products for query: '{}'", query);
        try {
            ApiResponseWrapper<List<ProductSummaryDTO>> response = 
                    embeddingClient.searchSimilarProducts(query, limit);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Failed to find similar products: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    @Override
    public List<ProductSummaryDTO> findProductsWithSorting(String keyword, String sortBy, String sortDirection, int limit) {
        log.debug("Finding products with sorting. keyword='{}', sortBy='{}', sortDirection='{}', limit={}",
                keyword, sortBy, sortDirection, limit);
        try {
            ApiResponseWrapper<List<ProductSummaryDTO>> response = 
                    embeddingClient.searchWithSorting(keyword, sortBy, sortDirection, limit);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Failed to find products with sorting: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    @Override
    public void updateProductEmbedding(Object product) {
        log.debug("updateProductEmbedding called - syncing all embeddings via product-service");
        syncProductEmbeddings();
    }

    @Override
    public long getEmbeddingCount() {
        try {
            ApiResponseWrapper<Object> response = embeddingClient.getEmbeddingStats();
            if (response != null && response.isSuccess() && response.getData() != null) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) response.getData();
                if (data.containsKey("totalEmbeddings")) {
                    return ((Number) data.get("totalEmbeddings")).longValue();
                }
            }
        } catch (Exception e) {
            log.error("Failed to get embedding count: {}", e.getMessage(), e);
        }
        return 0;
    }

    @Override
    public boolean hasEmbedding(Long productId) {
        try {
            ApiResponseWrapper<Object> response = embeddingClient.hasEmbedding(productId);
            if (response != null && response.isSuccess() && response.getData() != null) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> data = (java.util.Map<String, Object>) response.getData();
                if (data.containsKey("hasEmbedding")) {
                    return (Boolean) data.get("hasEmbedding");
                }
            }
        } catch (Exception e) {
            log.error("Failed to check embedding: {}", e.getMessage(), e);
        }
        return false;
    }

    @Override
    public String generateQueryVector(String query) {
        log.error("Chatbot service should NOT generate query vectors - this should be done in product-service");
        throw new UnsupportedOperationException(
                "Query vector generation should be done in product-service, not chatbot");
    }

    public List<ProductSummaryDTO> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int limit) {
        try {
            ApiResponseWrapper<List<ProductSummaryDTO>> response = 
                    embeddingClient.searchByPriceRange(minPrice, maxPrice, limit);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Failed to find by price range: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    public List<ProductSummaryDTO> findByBrand(String brand, int limit) {
        try {
            ApiResponseWrapper<List<ProductSummaryDTO>> response = 
                    embeddingClient.searchByBrand(brand, limit);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Failed to find by brand: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    public List<ProductSummaryDTO> findSimilarProductsWithPriceRange(
            String query, BigDecimal minPrice, BigDecimal maxPrice, int limit) {
        try {
            ApiResponseWrapper<List<ProductSummaryDTO>> response = 
                    embeddingClient.searchSimilarProductsWithPriceRange(query, minPrice, maxPrice, limit);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Failed to find similar products with price range: {}", e.getMessage(), e);
        }
        return Collections.emptyList();
    }
}
