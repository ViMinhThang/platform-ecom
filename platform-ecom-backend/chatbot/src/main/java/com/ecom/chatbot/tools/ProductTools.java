package com.ecom.chatbot.tools;

import com.ecom.chatbot.dto.ProductSummaryDTO;
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

    private static final ThreadLocal<List<ProductSummaryDTO>> lastFoundProducts = new ThreadLocal<>();

    public static List<ProductSummaryDTO> getLastFoundProducts() {
        return lastFoundProducts.get();
    }

    public static void clearLastFoundProducts() {
        lastFoundProducts.remove();
    }

    @Tool(description = "Semantic search for products by text query. Use for general searches like 'find phones' or 'show me laptops'")
    public List<ProductSummaryDTO> searchProducts(
            @ToolParam(description = "Search query text") String query,
            @ToolParam(description = "Max results (1-20), defaults to 5") Integer limit) {
        log.info("Tool searchProducts called with query='{}', limit={}", query, limit);
        int maxResults = (limit != null && limit > 0 && limit <= 20) ? limit : 5;

        List<ProductSummaryDTO> results = embeddingService.findSimilarProducts(query, maxResults);
        lastFoundProducts.set(results);
        return results;
    }

    @Tool(description = "Search products within a specific price range in VND. Use when user mentions price like '240k', '240 nghìn', 'dưới 10 triệu', or 'từ 5 đến 10 triệu'")
    public List<ProductSummaryDTO> searchByPriceRange(
            @ToolParam(description = "Minimum price in VND") BigDecimal minPrice,
            @ToolParam(description = "Maximum price in VND") BigDecimal maxPrice,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchByPriceRange called with min={}, max={}, limit={}", minPrice, maxPrice, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        List<ProductSummaryDTO> results = embeddingService.findByPriceRange(minPrice, maxPrice, maxResults);
        lastFoundProducts.set(results);
        return results;
    }

    @Tool(description = "Search products by brand name. Use when user asks for specific brand like 'Samsung', 'Apple', 'iPhone', 'Xiaomi'")
    public List<ProductSummaryDTO> searchByBrand(
            @ToolParam(description = "Brand name (Samsung, Apple, iPhone, etc.)") String brand,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchByBrand called with brand='{}', limit={}", brand, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        List<ProductSummaryDTO> results = embeddingService.findByBrand(brand, maxResults);
        lastFoundProducts.set(results);
        return results;
    }

    @Tool(description = "Get detailed information about a specific product by its URL slug")
    public ProductSummaryDTO getProductBySlug(@ToolParam(description = "Product URL slug") String slug) {
        log.info("Tool getProductBySlug called with slug='{}'", slug);
        return null;
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

        List<ProductSummaryDTO> products;

        if (minPrice != null && maxPrice != null) {
            products = embeddingService.findSimilarProductsWithPriceRange(query, minPrice, maxPrice, maxResults);
        } else {
            products = embeddingService.findSimilarProducts(query, maxResults);
        }

        lastFoundProducts.set(products);
        return products;
    }

    @Tool(description = "Search and sort products dynamically. Use this when the user asks for 'cheapest' (rẻ nhất), 'most expensive' (đắt nhất), 'best selling' (bán chạy nhất), or 'highest rated' (đánh giá cao nhất).")
    public List<ProductSummaryDTO> searchAndSortProducts(
            @ToolParam(description = "Search query or keyword (e.g. 'iphone', 'samsung', 'laptop'). Leave empty if no specific product is mentioned.") String query,
            @ToolParam(description = "Field to sort by. MUST be one of: 'price' (for cheapest/expensive), 'total_sold' (for best sellers), 'average_rating' (for highest rated).") String sortBy,
            @ToolParam(description = "Sort direction. MUST be 'ASC' (for cheapest) or 'DESC' (for most expensive, best selling, highest rated).") String sortDirection,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchAndSortProducts called with query='{}', sortBy='{}', sortDirection='{}', limit={}", query,
                sortBy, sortDirection, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        if (sortBy == null || sortBy.isBlank())
            sortBy = "price";
        if (sortDirection == null || sortDirection.isBlank())
            sortDirection = "ASC";

        List<ProductSummaryDTO> products = embeddingService.findProductsWithSorting(query, sortBy, sortDirection,
                maxResults);
        lastFoundProducts.set(products);
        return products;
    }
}
