package com.ecom.product.mapper;

import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductOptionValue;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.entity.VariantOptionValue;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Dedicated mapper and selector service for ProductVariant operations.
 * Handles variant selection logic and DTO mapping.
 */
@Component
public class ProductVariantMapper {

    /**
     * Maps ProductVariant entity to ProductVariantDTO
     */
    public ProductVariantDTO toDTO(ProductVariant variant) {
        if (variant == null) {
            return null;
        }

        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(variant.getId());
        dto.setProductId(variant.getProduct().getId());
        dto.setSku(variant.getSku());
        dto.setPrice(variant.getPrice());
        dto.setSalePrice(variant.getSalePrice());
        dto.setSaleStart(variant.getSaleStart());
        dto.setSaleEnd(variant.getSaleEnd());
        dto.setStock(variant.getStock());
        dto.setIsActive(variant.getIsActive());
        dto.setTotalSold(variant.getTotalSold());
        dto.setImageUrl(variant.getImageUrl());
        dto.setHidden(variant.getHidden());
        dto.setCreatedAt(variant.getCreatedAt());
        dto.setUpdatedAt(variant.getUpdatedAt());

        // Map option values if available
        if (variant.getOptionValues() != null) {
            dto.setOptionValues(mapVariantOptionValues(variant));
        }

        return dto;
    }

    /**
     * Maps list of variants to list of DTOs
     */
    public List<ProductVariantDTO> toDTOs(List<ProductVariant> variants) {
        if (variants == null) {
            return List.of();
        }

        return variants.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Maps only active and visible variants from a product (for public routes)
     */
    public List<ProductVariantDTO> mapActiveVariants(Product product) {
        if (product == null || product.getVariants() == null) {
            return List.of();
        }

        return product.getVariants().stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                .filter(v -> !Boolean.TRUE.equals(v.getHidden()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Finds the first available variant from a product
     * Prioritizes variants with stock, falls back to any active variant
     */
    public ProductVariantDTO findFirstAvailableVariant(Product product) {
        if (product == null || product.getVariants() == null) {
            return null;
        }

        Optional<ProductVariant> variant = findFirstVariantWithStock(product)
                .or(() -> findFirstActiveVariant(product));

        return variant.map(this::toDTO).orElse(null);
    }

    /**
     * Calculates minimum price from available variants
     */
    public BigDecimal calculateMinPrice(Product product) {
        if (product == null || product.getVariants() == null) {
            return null;
        }

        return product.getVariants().stream()
                .filter(this::isAvailableVariant)
                .map(ProductVariant::getEffectivePrice)
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    /**
     * Finds first variant with stock available
     */
    private Optional<ProductVariant> findFirstVariantWithStock(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .filter(v -> v.getStock() != null && v.getStock() > 0)
                .findFirst();
    }

    /**
     * Finds first active variant
     */
    private Optional<ProductVariant> findFirstActiveVariant(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .findFirst();
    }

    /**
     * Checks if variant is available (active and not hidden)
     */
    private boolean isAvailableVariant(ProductVariant variant) {
        return variant.getIsActive() != null && variant.getIsActive()
                && (variant.getHidden() == null || !variant.getHidden());
    }

    /**
     * Maps variant option values to DTOs
     */
    private List<VariantOptionValueDTO> mapVariantOptionValues(ProductVariant variant) {
        return variant.getOptionValues().stream()
                .map(this::mapToVariantOptionValueDTO)
                .collect(Collectors.toList());
    }

    /**
     * Maps single variant option value to DTO
     */
    private VariantOptionValueDTO mapToVariantOptionValueDTO(VariantOptionValue vov) {
        VariantOptionValueDTO dto = new VariantOptionValueDTO();
        dto.setId(vov.getId());
        dto.setVariantId(vov.getVariant().getId());
        dto.setOptionId(vov.getOptionValue().getOption().getId());
        dto.setPriceModifier(vov.getPriceModifier());
        dto.setProductOptionValue(mapToProductOptionValueDTO(vov.getOptionValue()));
        return dto;
    }

    /**
     * Maps product option value to DTO
     */
    private ProductOptionValueDTO mapToProductOptionValueDTO(ProductOptionValue pov) {
        ProductOptionValueDTO dto = new ProductOptionValueDTO();
        dto.setId(pov.getId());
        dto.setValue(pov.getValue());
        dto.setDisplayValue(pov.getDisplayValue());
        return dto;
    }
}
