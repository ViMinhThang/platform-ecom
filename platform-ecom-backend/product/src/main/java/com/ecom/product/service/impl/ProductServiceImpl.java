package com.ecom.product.service.impl;

import com.ecom.product.dto.*;
import com.ecom.product.dto.response.ProductResponse;
import com.ecom.product.entity.*;
import com.ecom.product.mapper.ProductMapper;
import com.ecom.product.mapper.ProductVariantMapper;
import com.ecom.product.utils.PageableUtils;
import java.util.*;
import com.ecom.product.repository.*;
import com.ecom.product.service.signature.ProductService;
import org.springframework.data.domain.*;
import com.ecom.product.helper.CategoryHelper;
import com.ecom.product.helper.ProductHelper;
import com.ecom.product.helper.ProductSearchHelper;
import com.ecom.product.helper.ProductVariantHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecom.product.client.UserServiceClient;
import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductVariantMapper productVariantMapper;
    private final UserServiceClient userServiceClient;
    private final ProductHelper productHelper;
    private final CategoryHelper categoryHelper;
    private final ProductVariantHelper productVariantHelper;
    private final ProductSearchHelper searchHelper;

    @Override
    @Transactional
    public ProductRowDTO createProduct(ProductDTO productDTO, Long userId) {
        Category category = categoryHelper.findByIdOrThrow(productDTO.getCate().getId());

        Product product = buildProductFromDTO(productDTO, category, userId);
        Product savedProduct = productRepository.save(product);

        return productMapper.toRowDTO(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long productId) {
        return productMapper.toDTO(productHelper.findByIdOrThrow(productId));
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product existingProduct = productHelper.findByIdOrThrow(productId);

        updateProductFields(existingProduct, productDTO);

        return productMapper.toDTO(productRepository.save(existingProduct));
    }

    @Override
    @Transactional
    public ProductDTO deleteProduct(Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);
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
        return searchHelper.getAllProductsForSeller(pageable, userId, name, category);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getAllPublicProducts(Integer page, Integer perPage,
            String category, String search,
            String sortBy, String sortOrder,
            BigDecimal minPrice, BigDecimal maxPrice, Double minRating,
            Boolean inStock, List<Long> sellerIds) {
        Pageable pageable = PageableUtils.createPageable(page, perPage, sortBy, sortOrder);
        return searchHelper.getAllPublicProducts(pageable, category, search, minPrice, maxPrice, minRating, inStock, sellerIds);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getPublicProductById(Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);
        productHelper.validateProductIsActive(product);

        return productMapper.toDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailDTO getProductWithVariants(Long productId) {
        Product product = productHelper.findByIdOrThrow(productId);
        productHelper.validateProductIsActive(product);

        return productMapper.toDetailDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductVariantDTO getVariantById(Long variantId) {
        ProductVariant variant = productVariantHelper.findByIdOrThrow(variantId);
        return productVariantMapper.toDTO(variant);
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
        Product product = productHelper.findBySlugOrThrow(slug);
        productHelper.validateProductIsActive(product);
        return productMapper.toDetailDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getAllPublicProductsBySeller(Long userId, Integer page, Integer perPage, String category,
            String sortBy, String sortOrder, BigDecimal minPrice, BigDecimal maxPrice, Double minRating, Boolean inStock) {
        Pageable pageable = PageableUtils.createPageable(page, perPage, sortBy, sortOrder);
        return searchHelper.getAllPublicProductsBySeller(userId, pageable, category, minPrice, maxPrice, minRating, inStock);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRowDTO> getProductsByIds(List<Long> productIds) {
        return productRepository.findAllById(productIds).stream()
                .filter(product -> "ACTIVE".equals(product.getStatus()))
                .map(productMapper::toRowDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getProductIdsBySellerId(Long sellerId) {
        return productRepository.findIdsByUserId(sellerId);
    }

    // ==================== Private Helper Methods ====================

    private Product buildProductFromDTO(ProductDTO productDTO, Category category, Long userId) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setStatus(productDTO.getStatus());
        product.setSpecifications(productDTO.getSpecifications());
        product.setMetadata(productDTO.getMetadata());
        product.setDescription(productDTO.getDescription());
        product.setCategory(category);
        product.setUserId(userId);
        return product;
    }

    private void updateProductFields(Product existingProduct, ProductDTO productDTO) {
        if (productDTO.getName() != null)
            existingProduct.setName(productDTO.getName());
        if (productDTO.getStatus() != null)
            existingProduct.setStatus(productDTO.getStatus());
        if (productDTO.getSpecifications() != null)
            existingProduct.setSpecifications(productDTO.getSpecifications());
        if (productDTO.getMetadata() != null)
            existingProduct.setMetadata(productDTO.getMetadata());
        if (productDTO.getDescription() != null)
            existingProduct.setDescription(productDTO.getDescription());
        if (productDTO.getCate() != null && productDTO.getCate().getId() != null) {
            existingProduct.setCategory(categoryHelper.findByIdOrThrow(productDTO.getCate().getId()));
        }
    }
}
