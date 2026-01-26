package com.ecom.product.mapper;

import com.ecom.product.dto.ProductOptionValueDTO;
import com.ecom.product.dto.ProductVariantDTO;
import com.ecom.product.dto.VariantOptionValueDTO;
import com.ecom.product.entity.*;
import com.ecom.product.repository.SaleCampaignItemRepository;
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

    private final SaleCampaignItemRepository saleCampaignItemRepository;

    public ProductVariantMapper(SaleCampaignItemRepository saleCampaignItemRepository) {
        this.saleCampaignItemRepository = saleCampaignItemRepository;
    }

    public ProductVariantDTO toDTO(ProductVariant variant) {
        if (variant == null) {
            return null;
        }

        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(variant.getId());
        dto.setProductId(variant.getProduct().getId());
        dto.setSku(variant.getSku());
        dto.setPrice(variant.getPrice());
        dto.setStock(variant.getStock());
        dto.setIsActive(variant.getIsActive());
        dto.setTotalSold(variant.getTotalSold());
        dto.setImageUrl(variant.getImageUrl());
        dto.setHidden(variant.getHidden());
        dto.setCreatedAt(variant.getCreatedAt());
        dto.setUpdatedAt(variant.getUpdatedAt());

        if (variant.getOptionValues() != null) {
            dto.setOptionValues(mapVariantOptionValues(variant));
        }

        // Check for active sale campaign
        saleCampaignItemRepository.findActiveSaleForVariant(variant.getId()).ifPresent(saleItem -> {
            dto.setSalePrice(saleItem.getSalePrice());
            dto.setDiscountPercent(saleItem.getDiscountPercent());
        });

        return dto;
    }

    public List<ProductVariantDTO> toDTOs(List<ProductVariant> variants) {
        if (variants == null) {
            return List.of();
        }

        return variants.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

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

    public ProductVariantDTO findFirstAvailableVariant(Product product) {
        if (product == null || product.getVariants() == null) {
            return null;
        }

        Optional<ProductVariant> variant = findFirstVariantWithStock(product)
                .or(() -> findFirstActiveVariant(product));

        return variant.map(this::toDTO).orElse(null);
    }

    public BigDecimal calculateMinPrice(Product product) {
        if (product == null || product.getVariants() == null) {
            return null;
        }

        return product.getVariants().stream()
                .filter(this::isAvailableVariant)
                .map(v -> {
                    BigDecimal basePrice = v.getPrice();
                    return saleCampaignItemRepository.findActiveSaleForVariant(v.getId())
                            .map(SaleCampaignItem::getSalePrice)
                            .orElse(basePrice);
                })
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    private Optional<ProductVariant> findFirstVariantWithStock(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .filter(v -> v.getStock() != null && v.getStock() > 0)
                .findFirst();
    }

    private Optional<ProductVariant> findFirstActiveVariant(Product product) {
        return product.getVariants().stream()
                .filter(ProductVariant::getIsActive)
                .findFirst();
    }

    private boolean isAvailableVariant(ProductVariant variant) {
        return variant.getIsActive() != null && variant.getIsActive()
                && (variant.getHidden() == null || !variant.getHidden());
    }

    private List<VariantOptionValueDTO> mapVariantOptionValues(ProductVariant variant) {
        return variant.getOptionValues().stream()
                .map(this::mapToVariantOptionValueDTO)
                .collect(Collectors.toList());
    }

    private VariantOptionValueDTO mapToVariantOptionValueDTO(VariantOptionValue vov) {
        VariantOptionValueDTO dto = new VariantOptionValueDTO();
        dto.setId(vov.getId());
        dto.setVariantId(vov.getVariant().getId());
        dto.setOptionId(vov.getOptionValue().getOption().getId());
        dto.setPriceModifier(vov.getPriceModifier());
        dto.setProductOptionValue(mapToProductOptionValueDTO(vov.getOptionValue()));
        return dto;
    }

    private ProductOptionValueDTO mapToProductOptionValueDTO(ProductOptionValue pov) {
        ProductOptionValueDTO dto = new ProductOptionValueDTO();
        dto.setId(pov.getId());
        dto.setValue(pov.getValue());
        dto.setDisplayValue(pov.getDisplayValue());
        return dto;
    }
}
