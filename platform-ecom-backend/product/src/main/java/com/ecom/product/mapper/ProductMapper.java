package com.ecom.product.mapper;

import com.ecom.product.dto.*;
import com.ecom.product.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Dedicated mapper class for Product entity to DTO conversions.
 * Extracted from ProductServiceImpl to follow Single Responsibility Principle.
 */
@Component
public class ProductMapper {

    private static final String DEFAULT_IMAGE_URL = "placehold.co/600x400";

    private final CategoryMapper categoryMapper;
    private final ProductVariantMapper productVariantMapper;

    public ProductMapper(CategoryMapper categoryMapper, ProductVariantMapper productVariantMapper) {
        this.categoryMapper = categoryMapper;
        this.productVariantMapper = productVariantMapper;
    }

    /**
     * Maps Product entity to ProductDTO
     */
    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setCate(categoryMapper.toDTO(product.getCategory()));
        dto.setStatus(product.getStatus());
        dto.setMinPrice(product.getMinPrice());
        dto.setSpecifications(product.getSpecifications());
        dto.setMetadata(product.getMetadata());
        dto.setDescription(product.getDescription());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setTotalSold(product.getTotalSold());
        dto.setTotalReviews(product.getTotalReviews());
        dto.setAverageRating(product.getAverageRating());
        dto.setUserId(product.getUserId());
        dto.setSlug(product.getSlug());

        return dto;
    }

    /**
     * Maps Product entity to ProductRowDTO for list views
     */
    public ProductRowDTO toRowDTO(Product product) {
        if (product == null) {
            return null;
        }

        return ProductRowDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .category(categoryMapper.toDTO(product.getCategory()))
                .imageUrl(getFirstImageUrl(product))
                .status(product.getStatus())
                .minPrice(productVariantMapper.calculateMinPrice(product))
                .variants(product.getVariants() != null ? product.getVariants().size() : 0)
                .firstVariant(productVariantMapper.findFirstAvailableVariant(product))
                .totalSold(product.getTotalSold())
                .totalReviews(product.getTotalReviews())
                .averageRating(product.getAverageRating())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .slug(product.getSlug())
                .build();
    }

    public ProductDetailDTO toDetailDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setCate(categoryMapper.toDTO(product.getCategory()));
        dto.setStatus(product.getStatus());
        dto.setMinPrice(product.getMinPrice());
        dto.setSpecifications(product.getSpecifications());
        dto.setMetadata(product.getMetadata());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        dto.setDescription(product.getDescription());
        dto.setTotalSold(product.getTotalSold());
        dto.setTotalReviews(product.getTotalReviews());
        dto.setAverageRating(product.getAverageRating());
        dto.setUserId(product.getUserId());
        // Map collections
        dto.setOptions(mapProductOptions(product));
        dto.setVariants(productVariantMapper.mapActiveVariants(product));
        dto.setImages(mapProductImages(product));

        return dto;
    }

    public List<ProductRowDTO> toRowDTOs(List<Product> products) {
        if (products == null) {
            return List.of();
        }

        return products.stream()
                .map(this::toRowDTO)
                .collect(Collectors.toList());
    }

    private String getFirstImageUrl(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return DEFAULT_IMAGE_URL;
        }
        return product.getImages().iterator().next().getImageUrl();
    }

    private List<ProductOptionDTO> mapProductOptions(Product product) {
        if (product.getOptions() == null) {
            return List.of();
        }

        return product.getOptions().stream()
                .map(this::mapProductOptionToDTO)
                .collect(Collectors.toList());
    }

    private ProductOptionDTO mapProductOptionToDTO(ProductOption option) {
        ProductOptionDTO dto = new ProductOptionDTO();
        dto.setId(option.getId());
        dto.setName(option.getName());
        dto.setDisplayName(option.getDisplayName());

        if (option.getValues() != null) {
            dto.setValues(option.getValues().stream()
                    .map(this::mapProductOptionValueToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private ProductOptionValueDTO mapProductOptionValueToDTO(ProductOptionValue value) {
        ProductOptionValueDTO dto = new ProductOptionValueDTO();
        dto.setId(value.getId());
        dto.setValue(value.getValue());
        dto.setDisplayValue(value.getDisplayValue());
        return dto;
    }

    private List<ProductImageDTO> mapProductImages(Product product) {
        if (product.getImages() == null) {
            return List.of();
        }

        return product.getImages().stream()
                .map(this::mapProductImageToDTO)
                .collect(Collectors.toList());
    }

    private ProductImageDTO mapProductImageToDTO(ProductImage image) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setProductId(image.getProduct().getId());
        dto.setCreatedAt(image.getCreatedAt());
        return dto;
    }
}
