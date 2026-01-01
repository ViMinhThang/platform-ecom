package com.ecom.chatbot.service;

import com.ecom.chatbot.client.ProductServiceClient;
import com.ecom.chatbot.dto.ProductDTO;
import com.ecom.chatbot.dto.ProductResponse;
import com.ecom.chatbot.dto.ProductSummaryDTO;
import com.ecom.chatbot.repository.ProductEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing product embeddings and semantic search.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmbeddingService {

    private final ProductEmbeddingRepository repository;
    private final GeminiService geminiService;
    private final ProductServiceClient productClient;

    /**
     * Sync all product embeddings from Product service.
     * Fetches products and generates/updates embeddings for each.
     */
    @Transactional
    public void syncProductEmbeddings() {
        log.info("Starting product embeddings sync...");
        int page = 0;
        int perPage = 100;
        int totalSynced = 0;
        int totalFailed = 0;

        try {
            while (true) {
                var apiResponse = productClient.getAllPublicProducts(page, perPage);

                if (apiResponse == null || !apiResponse.isSuccess() || apiResponse.getData() == null) {
                    log.warn("Failed to fetch products from Product service");
                    break;
                }

                ProductResponse response = apiResponse.getData();

                if (response.getProducts() == null || response.getProducts().isEmpty()) {
                    break;
                }

                for (ProductDTO product : response.getProducts()) {
                    try {
                        updateProductEmbedding(product);
                        totalSynced++;
                    } catch (Exception e) {
                        log.error("Failed to sync embedding for product {}: {}",
                                product.getId(), e.getMessage());
                        totalFailed++;
                    }
                }

                log.info("Synced page {} with {} products", page, response.getProducts().size());

                // Check if we've processed all products
                if (response.getProducts().size() < perPage) {
                    break;
                }
                page++;
            }
        } catch (Exception e) {
            log.error("Error during embeddings sync: {}", e.getMessage(), e);
        }

        log.info("Completed embeddings sync. Success: {}, Failed: {}", totalSynced, totalFailed);
    }

    /**
     * Find similar products using vector similarity search.
     *
     * @param query User's search query
     * @param limit Maximum number of results
     * @return List of products with similarity scores
     */
    public List<ProductSummaryDTO> findSimilarProducts(String query, int limit) {
        log.debug("Finding similar products for query: '{}'", query);

        // Generate embedding for user query
        float[] queryEmbedding = geminiService.generateQueryEmbedding(query);

        // Convert to pgvector format string
        String vectorString = arrayToVectorString(queryEmbedding);

        // Query database for similar products
        List<Object[]> results = repository.findSimilarProducts(vectorString, limit);

        return results.stream()
                .map(this::mapToProductSummary)
                .collect(Collectors.toList());
    }

    /**
     * Create or update embedding for a single product.
     * Uses native SQL upsert for proper vector type casting.
     */
    @Transactional
    public void updateProductEmbedding(ProductDTO product) {
        String textToEmbed = buildEmbeddingText(product);
        float[] embedding = geminiService.generateDocumentEmbedding(textToEmbed);
        String vectorString = arrayToVectorString(embedding);

        // Use native upsert with proper vector casting
        repository.upsertProductEmbedding(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getCate() != null ? product.getCate().getName() : null,
                vectorString,
                product.getMinPrice(),
                product.getAverageRating(),
                product.getTotalSold());

        log.debug("Updated embedding for product: {} ({})", product.getName(), product.getId());
    }

    /**
     * Build text representation of product for embedding generation.
     * Combines name, description, and category for rich semantic context.
     */
    private String buildEmbeddingText(ProductDTO product) {
        StringBuilder sb = new StringBuilder();

        // Product name is most important
        sb.append(product.getName());

        // Add description if available
        if (product.getDescription() != null && !product.getDescription().isEmpty()) {
            sb.append(". ").append(product.getDescription());
        }

        // Add category for context
        if (product.getCate() != null && product.getCate().getName() != null) {
            sb.append(". Category: ").append(product.getCate().getName());
        }

        // Limit text length to avoid token limits
        String text = sb.toString();
        if (text.length() > 2000) {
            text = text.substring(0, 2000);
        }

        return text;
    }

    /**
     * Convert float array to pgvector format string.
     * Format: [0.1,0.2,0.3,...]
     */
    private String arrayToVectorString(float[] embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            if (i > 0)
                sb.append(",");
            sb.append(embedding[i]);
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Map database result to ProductSummaryDTO.
     */
    private ProductSummaryDTO mapToProductSummary(Object[] row) {
        return ProductSummaryDTO.builder()
                .id(row[0] != null ? ((Number) row[0]).longValue() : null)
                .name((String) row[1])
                .slug((String) row[2])
                .description((String) row[3])
                .categoryName((String) row[4])
                .price(row[5] != null ? new BigDecimal(row[5].toString()) : null)
                .averageRating(row[6] != null ? ((Number) row[6]).doubleValue() : null)
                .totalSold(row[7] != null ? ((Number) row[7]).longValue() : null)
                // row[8] is updated_at
                // row[9] is embedding
                .similarityScore(row.length > 10 && row[10] != null ? ((Number) row[10]).doubleValue() : null)
                .build();
    }

    /**
     * Get the count of products with embeddings.
     */
    public long getEmbeddingCount() {
        return repository.countWithEmbeddings();
    }

    /**
     * Check if a product has an embedding.
     */
    public boolean hasEmbedding(Long productId) {
        return repository.existsByProductId(productId);
    }
}
