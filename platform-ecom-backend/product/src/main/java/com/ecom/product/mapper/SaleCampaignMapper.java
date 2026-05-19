package com.ecom.product.mapper;

import com.ecom.product.dto.*;
import com.ecom.product.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SaleCampaignMapper {

    public SaleCampaignDTO toDTO(SaleCampaign saleCampaign, boolean includeItems) {
        if (saleCampaign == null) {
            return null;
        }

        return SaleCampaignDTO.builder()
                .id(saleCampaign.getId())
                .name(saleCampaign.getName())
                .slug(saleCampaign.getSlug())
                .description(saleCampaign.getDescription())
                .bannerUrl(saleCampaign.getBannerUrl())
                .status(saleCampaign.getStatus().name())
                .startTime(saleCampaign.getStartTime())
                .endTime(saleCampaign.getEndTime())
                .items(includeItems ? toItemDTOList(saleCampaign.getItems()) : Collections.emptyList())
                .categories(toCategoryDTOList(saleCampaign.getCategories()))
                .discountTiers(toTierDTOList(saleCampaign.getDiscountTiers()))
                .totalItems(saleCampaign.getItems() != null ? saleCampaign.getItems().size() : 0)
                .remainingSeconds(saleCampaign.getRemainingSeconds())
                .createdAt(saleCampaign.getCreatedAt())
                .updatedAt(saleCampaign.getUpdatedAt())
                .build();
    }

    public SaleCampaignItemDTO toItemDTO(SaleCampaignItem item) {
        if (item == null) {
            return null;
        }

        ProductVariant variant = item.getVariant();
        Product product = variant.getProduct();

        return SaleCampaignItemDTO.builder()
                .id(item.getId())
                .variantId(variant.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .variantSku(variant.getSku())
                .imageUrl(variant.getImageUrl() != null ? variant.getImageUrl() : getProductMainImage(product))
                .originalPrice(variant.getPrice())
                .salePrice(item.getSalePrice())
                .discountPercent(item.getDiscountPercent())
                .stockLimit(item.getStockLimit())
                .soldCount(item.getSoldCount())
                .remainingStock(item.getRemainingStock())
                .sortOrder(item.getSortOrder())
                .isAvailable(item.isAvailable())
                .build();
    }

    public List<SaleCampaignItemDTO> toItemDTOList(List<SaleCampaignItem> items) {
        if (items == null) {
            return Collections.emptyList();
        }
        return items.stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());
    }

    public SaleCampaignCategoryDTO toCategoryDTO(SaleCampaignCategory saleCampaignCategory) {
        if (saleCampaignCategory == null) {
            return null;
        }

        Category category = saleCampaignCategory.getCategory();
        return SaleCampaignCategoryDTO.builder()
                .id(saleCampaignCategory.getId())
                .categoryId(category.getId())
                .categoryName(category.getName())
                .categorySlug(category.getSlug())
                .categoryImageUrl(category.getImageUrl())
                .build();
    }

    public List<SaleCampaignCategoryDTO> toCategoryDTOList(List<SaleCampaignCategory> categories) {
        if (categories == null) {
            return Collections.emptyList();
        }
        return categories.stream()
                .map(this::toCategoryDTO)
                .collect(Collectors.toList());
    }

    public SaleCampaignDiscountTierDTO toTierDTO(SaleCampaignDiscountTier tier) {
        if (tier == null) {
            return null;
        }

        return SaleCampaignDiscountTierDTO.builder()
                .id(tier.getId())
                .minPrice(tier.getMinPrice())
                .maxPrice(tier.getMaxPrice())
                .discountPercent(tier.getDiscountPercent())
                .sortOrder(tier.getSortOrder())
                .build();
    }

    public List<SaleCampaignDiscountTierDTO> toTierDTOList(List<SaleCampaignDiscountTier> tiers) {
        if (tiers == null) {
            return Collections.emptyList();
        }
        return tiers.stream()
                .map(this::toTierDTO)
                .collect(Collectors.toList());
    }

    private String getProductMainImage(Product product) {
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            return product.getImages().iterator().next().getImageUrl();
        }
        return null;
    }
}
