package com.ecom.product.service.impl;

import com.ecom.product.dto.ProductSummaryDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.repository.ProductRepository;
import com.ecom.product.service.signature.EmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmbeddingServiceImpl implements EmbeddingService {

    private final ProductRepository productRepository;
    private final EmbeddingModel embeddingModel;

    private static final String PRODUCT_STATUS = "ACTIVE";

    @Override
    @Transactional
    public void syncProductEmbeddings() {
        log.info("Starting product embeddings sync...");
        int page = 0;
        int perPage = 100;
        int totalSynced = 0;
        int totalFailed = 0;

        try {
            while (true) {
                Page<Product> productsPage = productRepository.findAllActiveForSync(
                        PRODUCT_STATUS, PageRequest.of(page, perPage));

                List<Product> products = productsPage.getContent();

                if (products.isEmpty()) {
                    break;
                }

                for (Product product : products) {
                    try {
                        generateAndSaveEmbedding(product);
                        totalSynced++;
                    } catch (Exception e) {
                        log.error("Failed to sync embedding for product {}: {}", product.getId(), e.getMessage());
                        totalFailed++;
                    }
                }

                log.info("Synced page {} with {} products", page, products.size());

                if (!productsPage.hasNext()) {
                    break;
                }
                page++;
            }
        } catch (Exception e) {
            log.error("Error during embeddings sync: {}", e.getMessage(), e);
        }

        log.info("Completed embeddings sync. Success: {}, Failed: {}", totalSynced, totalFailed);
    }

    @Override
    public List<ProductSummaryDTO> findSimilarProducts(String query, int limit) {
        log.debug("Finding similar products for query: '{}'", query);

        String vectorString = generateQueryVector(query);
        List<Object[]> results = productRepository.findSimilarProducts(vectorString, limit);

        return results.stream()
                .map(this::mapToProductSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductSummaryDTO> findSimilarProductsWithPriceRange(String query, BigDecimal minPrice,
            BigDecimal maxPrice, int limit) {
        log.debug("Finding similar products with price range for query: '{}', min={}, max={}", query, minPrice, maxPrice);

        String vectorString = generateQueryVector(query);
        List<Object[]> results = productRepository.findSimilarProductsWithPriceRange(vectorString, minPrice, maxPrice, limit);

        return results.stream()
                .map(this::mapToProductSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateProductEmbedding(Long productId) {
        productRepository.findById(productId).ifPresent(this::generateAndSaveEmbedding);
    }

    @Override
    @Transactional
    public void updateProductEmbeddingBatch(List<Long> productIds) {
        List<Product> products = productRepository.findAllWithAssociations(productIds);
        for (Product product : products) {
            try {
                generateAndSaveEmbedding(product);
            } catch (Exception e) {
                log.error("Failed to sync embedding for product {}: {}", product.getId(), e.getMessage());
            }
        }
    }

    @Override
    public long getEmbeddingCount() {
        return productRepository.countWithEmbeddings();
    }

    @Override
    public boolean hasEmbedding(Long productId) {
        return productRepository.findById(productId)
                .map(p -> p.getEmbedding() != null)
                .orElse(false);
    }

    @Override
    public String generateQueryVector(String query) {
        float[] embedding = embeddingModel.embed(query);
        return arrayToVectorString(embedding);
    }

    @Override
    public List<ProductSummaryDTO> findProductsWithSorting(String keyword, String sortBy, String sortDirection, int limit) {
        log.debug("Finding products with dynamic sorting. keyword='{}', sortBy='{}', sortDirection='{}', limit={}",
                keyword, sortBy, sortDirection, limit);

        List<Object[]> results;
        if ("DESC".equalsIgnoreCase(sortDirection)) {
            results = productRepository.findProductsDynamicSortDesc(keyword == null ? "" : keyword, sortBy, limit);
        } else {
            results = productRepository.findProductsDynamicSortAsc(keyword == null ? "" : keyword, sortBy, limit);
        }

        return results.stream()
                .map(this::mapToProductSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductSummaryDTO> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, int limit) {
        List<Object[]> results = productRepository.findByPriceRange(minPrice, maxPrice, limit);
        return results.stream()
                .map(this::mapToProductSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductSummaryDTO> findByBrand(String brand, int limit) {
        List<Object[]> results = productRepository.findByBrand(brand, limit);
        return results.stream()
                .map(this::mapToProductSummary)
                .collect(Collectors.toList());
    }

    private void generateAndSaveEmbedding(Product product) {
        String textToEmbed = buildEmbeddingText(product);
        String vectorString = generateEmbeddingVector(textToEmbed);
        productRepository.updateEmbedding(product.getId(), vectorString);
        log.debug("Updated embedding for product: {} ({})", product.getName(), product.getId());
    }

    private String generateEmbeddingVector(String text) {
        float[] embedding = embeddingModel.embed(text);
        return arrayToVectorString(embedding);
    }

    private String buildEmbeddingText(Product product) {
        StringBuilder sb = new StringBuilder();

        sb.append(product.getName());

        if (product.getDescription() != null && !product.getDescription().isEmpty()) {
            sb.append(". ").append(product.getDescription());
        }
        if (product.getCategory() != null && product.getCategory().getName() != null) {
            sb.append(". Category: ").append(product.getCategory().getName());
        }
        if (product.getMinPrice() != null) {
            sb.append(". Price: ").append(product.getMinPrice()).append(" VND");
        }

        String text = sb.toString();
        if (text.length() > 2000) {
            text = text.substring(0, 2000);
        }

        return text;
    }

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
                .imageUrl(row.length > 10 && row[10] != null ? (String) row[10] : null)
                .similarityScore(row.length > 11 && row[11] != null ? ((Number) row[11]).doubleValue() : null)
                .build();
    }
}
