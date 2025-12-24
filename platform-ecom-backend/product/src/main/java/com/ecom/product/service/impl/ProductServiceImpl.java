package com.ecom.product.service.impl;

import com.ecom.product.dto.*;
import com.ecom.product.entity.*;
import com.ecom.product.enums.ProductStatus;
import com.ecom.product.mapper.ProductMapper;
import com.ecom.product.mapper.ProductVariantMapper;
import com.ecom.product.utils.PageableUtils;
import java.util.*;
import com.ecom.product.repository.*;
import com.ecom.product.service.signature.ProductService;
import org.springframework.data.domain.*;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.product.utils.ProductUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecom.product.client.UserServiceClient;
import java.math.BigDecimal;
import java.util.stream.Collectors;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMapper productMapper;
    private final ProductVariantMapper productVariantMapper;
    private final UserServiceClient userServiceClient;

    @Override
    @Transactional
    public ProductRowDTO createProduct(ProductDTO productDTO, Long userId) {
        Category category = findCategoryById(productDTO.getCate().getId());

        Product product = buildProductFromDTO(productDTO, category, userId);
        Product savedProduct = productRepository.save(product);

        return productMapper.toRowDTO(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long productId) {
        Product product = findProductById(productId);
        return productMapper.toDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product existingProduct = findProductById(productId);

        // Explicit field updates - safer than modelMapper.map()
        if (productDTO.getName() != null) {
            existingProduct.setName(productDTO.getName());
        }
        if (productDTO.getDescription() != null) {
            existingProduct.setDescription(sanitizeDescription(productDTO.getDescription()));
        }
        if (productDTO.getStatus() != null) {
            existingProduct.setStatus(productDTO.getStatus());
        }
        if (productDTO.getSpecifications() != null) {
            existingProduct.setSpecifications(productDTO.getSpecifications());
        }
        if (productDTO.getMetadata() != null) {
            existingProduct.setMetadata(productDTO.getMetadata());
        }
        if (productDTO.getCate() != null && productDTO.getCate().getId() != null) {
            Category category = findCategoryById(productDTO.getCate().getId());
            existingProduct.setCategory(category);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toDTO(updatedProduct);
    }

    @Override
    @Transactional
    public ProductDTO deleteProduct(Long productId) {
        Product product = findProductById(productId);
        ProductDTO productDTO = productMapper.toDTO(product);
        productRepository.delete(product);

        return productDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getAllProductsForSeller(Integer page, Integer perPage,
            String name, String category,
            String sortBy, String sortOrder,
            Long userId) {
        Pageable pageable = PageableUtils.createPageable(page, perPage, sortBy, sortOrder);

        Specification<Product> specification = buildSellerProductSpecification(userId, name, category);

        return fetchAndMapProducts(specification, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getAllPublicProducts(Integer page, Integer perPage,
            String category, String search,
            String sortBy, String sortOrder,
            BigDecimal minPrice, BigDecimal maxPrice, Double minRating) {
        Pageable pageable = PageableUtils.createPageable(page, perPage, sortBy, sortOrder);

        Specification<Product> specification = buildPublicProductSpecification(search, category, minPrice, maxPrice,
                minRating);

        return fetchAndMapProducts(specification, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getPublicProductById(Long productId) {
        Product product = findProductById(productId);
        validateProductIsActive(product);

        return productMapper.toDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailDTO getProductWithVariants(Long productId) {
        Product product = findProductById(productId);
        validateProductIsActive(product);

        return productMapper.toDetailDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductVariantDTO getVariantById(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant", "Id", variantId));
        return productVariantMapper.toDTO(variant);
    }

    // ==================== Private Helper Methods ====================

    private Category findCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "Id", categoryId));
    }

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));
    }

    private void validateProductIsActive(Product product) {
        if (!ProductStatus.ACTIVE.getValue().equals(product.getStatus()) || Boolean.TRUE.equals(product.getDeleted())) {
            throw new ResourceNotFoundException("Product", "ProductId", product.getId());
        }
    }

    private Product buildProductFromDTO(ProductDTO productDTO, Category category, Long userId) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(sanitizeDescription(productDTO.getDescription()));
        product.setStatus(productDTO.getStatus());
        product.setSpecifications(productDTO.getSpecifications());
        product.setMetadata(productDTO.getMetadata());
        product.setCategory(category);
        product.setUserId(userId);
        return product;
    }

    private Specification<Product> buildSellerProductSpecification(Long userId, String name, String category) {
        return Specification.allOf(ProductUtils.userIdEquals(userId))
                .and(ProductUtils.nameContains(name))
                .and(ProductUtils.categoryEquals(category));
    }

    private Specification<Product> buildPublicProductSpecification(String search, String category, BigDecimal minPrice,
            BigDecimal maxPrice, Double minRating) {
        // Start with base filters: ACTIVE status AND not deleted
        Specification<Product> spec = ProductUtils.statusEquals(ProductStatus.ACTIVE.getValue())
                .and(ProductUtils.isNotDeleted());

        if (search != null && !search.isEmpty()) {
            spec = spec.and(ProductUtils.nameContains(search));
        }

        // Support both category name and slug
        if (category != null && !category.isEmpty()) {
            // Try slug first, fall back to name for backward compatibility
            spec = spec.and(ProductUtils.categorySlugEquals(category)
                    .or(ProductUtils.categoryEquals(category)));
        }

        // Apply price range filter
        if (minPrice != null || maxPrice != null) {
            spec = spec.and(ProductUtils.priceRange(minPrice, maxPrice));
        }

        // Apply rating filter
        if (minRating != null) {
            spec = spec.and(ProductUtils.ratingGreaterThanOrEqual(minRating));
        }

        return spec;
    }

    private ProductResponse fetchAndMapProducts(Specification<Product> specification, Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(specification, pageable);
        List<ProductRowDTO> productRows = productMapper.toRowDTOs(productPage.getContent());

        return buildProductResponse(productPage, productRows);
    }

    private ProductResponse buildProductResponse(Page<Product> productPage, List<ProductRowDTO> productRows) {
        ProductResponse response = new ProductResponse();
        response.setContent(productRows);
        response.setPageNumber(productPage.getNumber());
        response.setPageSize(productPage.getSize());
        response.setTotalElements(productPage.getTotalElements());
        response.setTotalPages(productPage.getTotalPages());
        response.setLastPage(productPage.isLast());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopSellerDTO> getTopSellersByCategory(String categorySlug, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> results = productRepository.findTopSellersByCategorySlug(categorySlug, pageable);

        return results.stream()
                .map(row -> {
                    Long userId = (Long) row[0];
                    UserDTO user = userServiceClient.getUserSafe(userId);

                    return TopSellerDTO.builder()
                            .sellerId(userId)
                            .sellerName(user != null ? user.getUsername() : "Unknown Seller")
                            .imageUrl(user != null ? user.getImageUrl() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        validateProductIsActive(product);
        return productMapper.toDetailDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getAllPublicProductsBySeller(Long userId, Integer page, Integer perPage, String category,
            String sortBy, String sortOrder, BigDecimal minPrice, BigDecimal maxPrice, Double minRating) {
        Pageable pageable = PageableUtils.createPageable(page, perPage, sortBy, sortOrder);

        Specification<Product> specification = buildPublicProductSpecification(null, category, minPrice, maxPrice,
                minRating).and(ProductUtils.userIdEquals(userId));

        return fetchAndMapProducts(specification, pageable);
    }

    private String sanitizeDescription(String description) {
        if (description == null)
            return null;
        PolicyFactory policy = Sanitizers.FORMATTING
                .and(Sanitizers.LINKS)
                .and(Sanitizers.BLOCKS)
                .and(Sanitizers.STYLES)
                .and(Sanitizers.IMAGES)
                .and(new org.owasp.html.HtmlPolicyBuilder()
                        .allowAttributes("data-image-id").onElements("img")
                        .toFactory());
        return policy.sanitize(description);
    }
}
