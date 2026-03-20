package com.ecom.product.controller;

import com.ecom.product.dto.ProductSummaryDTO;
import com.ecom.product.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/internal/embeddings")
@RequiredArgsConstructor
@Slf4j
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    @PostMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSimilarProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int limit) {
        log.info("REST searchSimilarProducts - query: '{}', limit: {}", query, limit);
        List<ProductSummaryDTO> results = embeddingService.findSimilarProducts(query, limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results
        ));
    }

    @PostMapping("/search-with-price")
    public ResponseEntity<Map<String, Object>> searchSimilarProductsWithPriceRange(
            @RequestParam String query,
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "5") int limit) {
        log.info("REST searchSimilarProductsWithPriceRange - query: '{}', minPrice: {}, maxPrice: {}, limit: {}",
                query, minPrice, maxPrice, limit);
        List<ProductSummaryDTO> results = embeddingService.findSimilarProductsWithPriceRange(
                query, minPrice, maxPrice, limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results
        ));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncEmbeddings() {
        log.info("REST syncEmbeddings called");
        embeddingService.syncProductEmbeddings();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Embedding sync completed"
        ));
    }

    @PostMapping("/sync/{productId}")
    public ResponseEntity<Map<String, Object>> syncProductEmbedding(@PathVariable Long productId) {
        log.info("REST syncProductEmbedding - productId: {}", productId);
        embeddingService.updateProductEmbedding(productId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product embedding updated"
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEmbeddingStats() {
        log.info("REST getEmbeddingStats called");
        long count = embeddingService.getEmbeddingCount();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "totalEmbeddings", count
                )
        ));
    }

    @PostMapping("/price-range")
    public ResponseEntity<Map<String, Object>> searchByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "5") int limit) {
        log.info("REST searchByPriceRange - minPrice: {}, maxPrice: {}, limit: {}", minPrice, maxPrice, limit);
        List<ProductSummaryDTO> results = embeddingService.findByPriceRange(minPrice, maxPrice, limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results
        ));
    }

    @PostMapping("/brand")
    public ResponseEntity<Map<String, Object>> searchByBrand(
            @RequestParam String brand,
            @RequestParam(defaultValue = "5") int limit) {
        log.info("REST searchByBrand - brand: '{}', limit: {}", brand, limit);
        List<ProductSummaryDTO> results = embeddingService.findByBrand(brand, limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results
        ));
    }

    @PostMapping("/sort")
    public ResponseEntity<Map<String, Object>> searchWithSorting(
            @RequestParam(required = false) String keyword,
            @RequestParam String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection,
            @RequestParam(defaultValue = "5") int limit) {
        log.info("REST searchWithSorting - keyword: '{}', sortBy: {}, sortDirection: {}, limit: {}",
                keyword, sortBy, sortDirection, limit);
        List<ProductSummaryDTO> results = embeddingService.findProductsWithSorting(
                keyword, sortBy, sortDirection, limit);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results
        ));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> hasEmbedding(@PathVariable Long productId) {
        log.info("REST hasEmbedding - productId: {}", productId);
        boolean hasEmbedding = embeddingService.hasEmbedding(productId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "hasEmbedding", hasEmbedding
                )
        ));
    }
}
