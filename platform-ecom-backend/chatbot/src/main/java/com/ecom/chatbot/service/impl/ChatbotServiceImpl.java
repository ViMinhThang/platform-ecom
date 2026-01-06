package com.ecom.chatbot.service.impl;

import com.ecom.chatbot.client.ProductServiceClient;
import com.ecom.chatbot.dto.*;
import com.ecom.chatbot.entity.ProductEmbedding;
import com.ecom.chatbot.repository.ProductEmbeddingRepository;
import com.ecom.chatbot.service.signature.ChatbotService;
import com.ecom.chatbot.service.signature.EmbeddingService;
import com.ecom.chatbot.service.signature.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    private final EmbeddingService embeddingService;
    private final GeminiService geminiService;
    private final ProductServiceClient productClient;
    private final ProductEmbeddingRepository embeddingRepository;

    @Override
    public ChatResponseDTO chat(ChatRequestDTO request) {
        long startTime = System.currentTimeMillis();
        log.info("Processing chat request: '{}'", request.getMessage());

        List<ProductSummaryDTO> similarProducts;

        try {
            if (request.getProductSlug() != null && !request.getProductSlug().isEmpty()) {
                log.debug("Fetching specific product by slug: {}", request.getProductSlug());
                similarProducts = fetchProductBySlug(request.getProductSlug());
            } else if (request.getProductId() != null) {
                log.debug("Fetching specific product by ID: {}", request.getProductId());
                similarProducts = fetchProductById(request.getProductId());
            } else {
                log.debug("Performing semantic search for: '{}'", request.getMessage());
                similarProducts = embeddingService.findSimilarProducts(
                        request.getMessage(),
                        request.getMaxResults() != null ? request.getMaxResults() : 5);
            }

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

    @Override
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

    private List<ProductSummaryDTO> fetchProductBySlug(String slug) {
        return embeddingRepository.findByProductSlug(slug)
                .map(embedding -> List.of(mapEmbeddingToSummary(embedding, 1.0)))
                .orElseGet(() -> {
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

    private List<ProductSummaryDTO> fetchProductById(Long productId) {
        return embeddingRepository.findById(productId)
                .map(embedding -> List.of(mapEmbeddingToSummary(embedding, 1.0)))
                .orElseGet(() -> {
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
