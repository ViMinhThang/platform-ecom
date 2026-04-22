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

    @Tool(description = """
        Semantic search for products by text query. Uses AI embeddings + keyword matching for accurate results.
        Use for general searches like 'find phones', 'show me laptops', 'tìm tai nghe'.
        For brand-specific searches (iPhone, Samsung, Apple), prefer searchByBrand tool instead.
        For searches with price constraints, prefer searchWithFilters tool instead.
        """)
    public List<ProductSummaryDTO> searchProducts(
            @ToolParam(description = "Search query text - the product name or type to search for") String query,
            @ToolParam(description = "Max results (1-20), defaults to 5") Integer limit) {
        log.info("Tool searchProducts called with query='{}', limit={}", query, limit);
        int maxResults = (limit != null && limit > 0 && limit <= 20) ? limit : 5;

        List<ProductSummaryDTO> results = embeddingService.findSimilarProducts(query, maxResults);

        // Fallback to brand text matching if semantic search returns no results
        if (results.isEmpty() && query != null && !query.isBlank()) {
            log.info("Semantic search returned no results, falling back to brand search for '{}'", query);
            results = embeddingService.findByBrand(query, maxResults);
        }

        lastFoundProducts.set(results);
        return results;
    }

    @Tool(description = """
        Search products within a specific price range in VND. NO keyword/brand filtering - only price.
        Use when user ONLY mentions price without a specific product type, e.g. 'sản phẩm dưới 10 triệu'.
        If user mentions BOTH a product/brand AND price, use searchWithFilters instead.
        Price examples: '240k' = 240000, '10 triệu' = 10000000, 'dưới 5 triệu' = maxPrice 5000000.
        """)
    public List<ProductSummaryDTO> searchByPriceRange(
            @ToolParam(description = "Minimum price in VND (use 0 if not specified)") BigDecimal minPrice,
            @ToolParam(description = "Maximum price in VND") BigDecimal maxPrice,
            @ToolParam(description = "Max results, defaults to 5") Integer limit) {
        log.info("Tool searchByPriceRange called with min={}, max={}, limit={}", minPrice, maxPrice, limit);
        int maxResults = (limit != null && limit > 0) ? limit : 5;

        List<ProductSummaryDTO> results = embeddingService.findByPriceRange(minPrice, maxPrice, maxResults);
        lastFoundProducts.set(results);
        return results;
    }

    @Tool(description = """
        Search products by brand or product line name using exact text matching.
        MUST use this when user asks for a specific brand: 'iPhone', 'Samsung', 'Apple', 'Xiaomi', 'Sony', 'MacBook', 'iPad', 'AirPods', etc.
        This tool does exact text matching on product names, not semantic search.
        For 'tìm iPhone' or 'sản phẩm Apple', use brand='iPhone' or brand='Apple'.
        """)
    public List<ProductSummaryDTO> searchByBrand(
            @ToolParam(description = "Brand or product line name (iPhone, Samsung, Apple, Xiaomi, Sony, etc.)") String brand,
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

    @Tool(description = """
        RECOMMENDED tool when user mentions BOTH a product keyword/brand AND a price range.
        Examples: 'iPhone dưới 10 triệu', 'laptop từ 15 đến 25 triệu', 'tai nghe Samsung giá rẻ'.
        Combines AI semantic search + keyword text matching + price filtering for best accuracy.
        For the query parameter, pass the product keyword/brand (e.g. 'iPhone', 'laptop gaming').
        """)
    public List<ProductSummaryDTO> searchWithFilters(
            @ToolParam(description = "Product keyword or brand name to search for (e.g. 'iPhone', 'laptop', 'tai nghe Samsung')") String query,
            @ToolParam(description = "Minimum price in VND, use 0 if no minimum specified") BigDecimal minPrice,
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

        // If semantic search returns no results, fall back to brand text matching
        if (products.isEmpty() && query != null && !query.isBlank()) {
            log.info("Semantic search returned no results, falling back to brand search for '{}'", query);
            products = embeddingService.findByBrand(query, maxResults);
        }

        lastFoundProducts.set(products);
        return products;
    }

    @Tool(description = """
        Search and sort products dynamically. Use this when the user asks for:
        - 'cheapest' or 'rẻ nhất' -> sortBy='price', sortDirection='ASC'
        - 'most expensive' or 'đắt nhất' -> sortBy='price', sortDirection='DESC'
        - 'best selling' or 'bán chạy nhất' -> sortBy='total_sold', sortDirection='DESC'
        - 'highest rated' or 'đánh giá cao nhất' -> sortBy='average_rating', sortDirection='DESC'
        """)
    public List<ProductSummaryDTO> searchAndSortProducts(
            @ToolParam(description = "Search query or keyword (e.g. 'iphone', 'samsung', 'laptop'). Leave empty if no specific product.") String query,
            @ToolParam(description = "Field to sort by: 'price', 'total_sold', or 'average_rating'") String sortBy,
            @ToolParam(description = "Sort direction: 'ASC' (cheapest) or 'DESC' (most expensive, best selling, highest rated)") String sortDirection,
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
