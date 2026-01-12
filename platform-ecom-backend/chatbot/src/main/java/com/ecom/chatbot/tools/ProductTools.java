package com.ecom.chatbot.tools;

import com.ecom.chatbot.dto.ProductSummaryDTO;
import com.ecom.chatbot.entity.ProductEmbedding;
import com.ecom.chatbot.repository.ProductEmbeddingRepository;
import com.ecom.chatbot.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductTools {

    private final EmbeddingService embeddingService;
    private final ProductEmbeddingRepository repository;

    @Tool(description = "Semantic search for products by text query. Use for general searches like 'find phones' or 'show me laptops'")
    public List<ProductSummaryDTO> searchProducts(
            @ToolParam(description = "Search query text") String query,
            @ToolParam(description = "Max results (1-20), defaults to 5") Integer limit) {
        log.info("Tool searchProducts called with query='{}', limit={}", query, limit);
        int maxResults = (limit != null && limit > 0 && limit <= 20) ? limit : 5;
        return embeddingService.findSimilarProducts(query, maxResults);
    }

    @Tool(description = "Search products within a specific price range in VND. Use when user mentions price like '240k', '240 nghìn', 'dưới 10 triệu', or 'từ 5 đến 10 triệu'")
    public List<ProductSummaryDTO> searchByPriceRange(
            @ToolParam(description = "Minimum price in VND") BigDecimal minPrice,
            @ToolParam(description = "Maximum price in VND") BigDecimal maxPrice,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchByPriceRange called with min={}, max={}, limit={}", minPrice, maxPrice, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        List<Object[]> results = repository.findByPriceRange(minPrice, maxPrice, maxResults);
        return results.stream().map(this::mapToProductSummary).toList();
    }

    @Tool(description = "Search products by brand name. Use when user asks for specific brand like 'Samsung', 'Apple', 'iPhone', 'Xiaomi'")
    public List<ProductSummaryDTO> searchByBrand(
            @ToolParam(description = "Brand name (Samsung, Apple, iPhone, etc.)") String brand,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchByBrand called with brand='{}', limit={}", brand, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        List<Object[]> results = repository.findByBrand(brand, maxResults);
        return results.stream().map(this::mapToProductSummary).toList();
    }

    @Tool(description = "Get detailed information about a specific product by its URL slug")
    public ProductSummaryDTO getProductBySlug(
            @ToolParam(description = "Product URL slug") String slug) {
        log.info("Tool getProductBySlug called with slug='{}'", slug);
        return repository.findByProductSlug(slug)
                .map(this::embeddingToSummary)
                .orElse(null);
    }

    @Tool(description = "Combined search with both text query and optional price range filter")
    public List<ProductSummaryDTO> searchWithFilters(
            @ToolParam(description = "Search query text") String query,
            @ToolParam(description = "Minimum price in VND, null for no minimum") BigDecimal minPrice,
            @ToolParam(description = "Maximum price in VND, null for no maximum") BigDecimal maxPrice,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchWithFilters called with query='{}', min={}, max={}, limit={}",
                query, minPrice, maxPrice, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        // If price range is specified, use filtered search
        if (minPrice != null && maxPrice != null) {
            String vectorString = embeddingService.generateQueryVector(query);
            List<Object[]> results = repository.findSimilarProductsWithPriceRange(
                    vectorString, minPrice, maxPrice, maxResults);
            return results.stream().map(this::mapToProductSummary).toList();
        }

        // Otherwise, use standard semantic search
        return embeddingService.findSimilarProducts(query, maxResults);
    }

    private ProductSummaryDTO mapToProductSummary(Object[] row) {
        return ProductSummaryDTO.builder()
                .id(row[0] != null ? ((Number) row[0]).longValue() : null)
                .name((String) row[1])
                .slug((String) row[2])
                .description((String) row[3])
                .categoryName((String) row[4])
                .price(row[6] != null ? new BigDecimal(row[6].toString())
                        : (row[5] != null ? new BigDecimal(row[5].toString()) : null))
                .averageRating(row[7] != null ? ((Number) row[7]).doubleValue() : null)
                .totalSold(row[8] != null ? ((Number) row[8]).longValue() : null)
                .similarityScore(row.length > 11 && row[11] != null ? ((Number) row[11]).doubleValue() : 1.0)
                .build();
    }

    private ProductSummaryDTO embeddingToSummary(ProductEmbedding embedding) {
        return ProductSummaryDTO.builder()
                .id(embedding.getProductId())
                .name(embedding.getProductName())
                .slug(embedding.getProductSlug())
                .description(embedding.getDescription())
                .categoryName(embedding.getCategoryName())
                .price(embedding.getMinPrice())
                .averageRating(embedding.getAverageRating())
                .totalSold(embedding.getTotalSold())
                .similarityScore(1.0)
                .build();
    }
}
