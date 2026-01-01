package com.ecom.chatbot.service;

import com.ecom.chatbot.client.ProductServiceClient;
import com.ecom.chatbot.dto.*;
import com.ecom.chatbot.entity.ProductEmbedding;
import com.ecom.chatbot.repository.ProductEmbeddingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Main chatbot service that orchestrates AI responses.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final EmbeddingService embeddingService;
    private final GeminiService geminiService;
    private final ProductServiceClient productClient;
    private final ProductEmbeddingRepository embeddingRepository;

    /**
     * Process user chat message and return AI-generated response.
     *
     * @param request Chat request containing user message and options
     * @return Chat response with AI message and relevant products
     */
    public ChatResponseDTO chat(ChatRequestDTO request) {
        long startTime = System.currentTimeMillis();
        log.info("Processing chat request: '{}'", request.getMessage());

        List<ProductSummaryDTO> similarProducts;

        try {
            // If specific product requested, fetch it directly
            if (request.getProductSlug() != null && !request.getProductSlug().isEmpty()) {
                log.debug("Fetching specific product by slug: {}", request.getProductSlug());
                similarProducts = fetchProductBySlug(request.getProductSlug());
            } else if (request.getProductId() != null) {
                log.debug("Fetching specific product by ID: {}", request.getProductId());
                similarProducts = fetchProductById(request.getProductId());
            } else {
                // Find similar products via semantic search
                log.debug("Performing semantic search for: '{}'", request.getMessage());
                similarProducts = embeddingService.findSimilarProducts(
                        request.getMessage(),
                        request.getMaxResults() != null ? request.getMaxResults() : 5);
            }

            // Generate AI response
            String aiResponse = geminiService.generateProductSummary(
                    similarProducts,
                    request.getMessage());

            long processingTime = System.currentTimeMillis() - startTime;
            log.info("Chat request processed in {}ms, found {} products",
                    processingTime, similarProducts.size());

            return ChatResponseDTO.builder()
                    .message(aiResponse)
                    .products(similarProducts)
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(processingTime)
                    .build();

        } catch (Exception e) {
            log.error("Error processing chat request: {}", e.getMessage(), e);

            long processingTime = System.currentTimeMillis() - startTime;
            return ChatResponseDTO.builder()
                    .message("I'm sorry, I encountered an error while processing your request. " +
                            "Please try again or rephrase your question.")
                    .products(List.of())
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(processingTime)
                    .build();
        }
    }

    /**
     * Get AI summary for a specific product by slug.
     *
     * @param slug Product slug
     * @return Chat response with product summary
     */
    public ChatResponseDTO getProductSummary(String slug) {
        long startTime = System.currentTimeMillis();
        log.info("Getting product summary for slug: {}", slug);

        try {
            List<ProductSummaryDTO> products = fetchProductBySlug(slug);

            if (products.isEmpty()) {
                return ChatResponseDTO.builder()
                        .message("I couldn't find a product with slug: " + slug)
                        .products(List.of())
                        .timestamp(LocalDateTime.now())
                        .processingTimeMs(System.currentTimeMillis() - startTime)
                        .build();
            }

            String aiResponse = geminiService.generateProductSummary(
                    products,
                    "Tell me about this product in detail. Include key features, specifications, and who would benefit from this product.");

            return ChatResponseDTO.builder()
                    .message(aiResponse)
                    .products(products)
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(System.currentTimeMillis() - startTime)
                    .build();

        } catch (Exception e) {
            log.error("Error getting product summary: {}", e.getMessage(), e);
            return ChatResponseDTO.builder()
                    .message("I'm sorry, I couldn't retrieve information for this product.")
                    .products(List.of())
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }
    }

    /**
     * Fetch product by slug from embeddings or product service.
     */
    private List<ProductSummaryDTO> fetchProductBySlug(String slug) {
        // First try to get from embeddings cache
        return embeddingRepository.findByProductSlug(slug)
                .map(embedding -> List.of(mapEmbeddingToSummary(embedding, 1.0)))
                .orElseGet(() -> {
                    // Fall back to product service
                    try {
                        var apiResponse = productClient.getProductBySlug(slug);
                        if (apiResponse != null && apiResponse.isSuccess() && apiResponse.getData() != null) {
                            return List.of(mapProductToSummary(apiResponse.getData(), 1.0));
                        }
                        return List.of();
                    } catch (Exception e) {
                        log.warn("Could not fetch product by slug {}: {}", slug, e.getMessage());
                        return List.of();
                    }
                });
    }

    /**
     * Fetch product by ID from embeddings or product service.
     */
    private List<ProductSummaryDTO> fetchProductById(Long productId) {
        // First try to get from embeddings cache
        return embeddingRepository.findById(productId)
                .map(embedding -> List.of(mapEmbeddingToSummary(embedding, 1.0)))
                .orElseGet(() -> {
                    // Fall back to product service
                    try {
                        var apiResponse = productClient.getProductById(productId);
                        if (apiResponse != null && apiResponse.isSuccess() && apiResponse.getData() != null) {
                            return List.of(mapProductToSummary(apiResponse.getData(), 1.0));
                        }
                        return List.of();
                    } catch (Exception e) {
                        log.warn("Could not fetch product by ID {}: {}", productId, e.getMessage());
                        return List.of();
                    }
                });
    }

    /**
     * Map ProductEmbedding entity to ProductSummaryDTO.
     */
    private ProductSummaryDTO mapEmbeddingToSummary(ProductEmbedding embedding, Double similarity) {
        return ProductSummaryDTO.builder()
                .id(embedding.getProductId())
                .name(embedding.getProductName())
                .slug(embedding.getProductSlug())
                .description(embedding.getDescription())
                .categoryName(embedding.getCategoryName())
                .price(embedding.getMinPrice())
                .averageRating(embedding.getAverageRating())
                .totalSold(embedding.getTotalSold())
                .similarityScore(similarity)
                .build();
    }

    /**
     * Map ProductDTO to ProductSummaryDTO.
     */
    private ProductSummaryDTO mapProductToSummary(ProductDTO product, Double similarity) {
        return ProductSummaryDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .categoryName(product.getCate() != null ? product.getCate().getName() : null)
                .price(product.getMinPrice())
                .averageRating(product.getAverageRating())
                .totalSold(product.getTotalSold())
                .similarityScore(similarity)
                .build();
    }
}
