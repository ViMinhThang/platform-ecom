package com.ecom.product.helper;

import com.ecom.product.entity.*;
import com.ecom.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class SaleCampaignItemGenerator {

    private final ProductVariantRepository productVariantRepository;

    public List<SaleCampaignItem> generateItems(SaleCampaign saleCampaign) {
        List<SaleCampaignCategory> categories = saleCampaign.getCategories();
        List<SaleCampaignDiscountTier> tiers = saleCampaign.getDiscountTiers();

        if (categories == null || categories.isEmpty()) {
            log.warn("No categories selected for campaign: {}", saleCampaign.getId());
            return new ArrayList<>();
        }

        if (tiers == null || tiers.isEmpty()) {
            log.warn("No discount tiers defined for campaign: {}", saleCampaign.getId());
            return new ArrayList<>();
        }

        List<Long> categoryIds = categories.stream()
                .map(sc -> sc.getCategory().getId())
                .toList();
        List<ProductVariant> variants = productVariantRepository.findActiveByCategoryIds(categoryIds);

        log.info("Found {} variants from {} categories for campaign {}",
                variants.size(), categoryIds.size(), saleCampaign.getId());

        List<SaleCampaignDiscountTier> sortedTiers = tiers.stream()
                .sorted(Comparator.comparing(SaleCampaignDiscountTier::getSortOrder))
                .toList();

        List<SaleCampaignItem> items = new ArrayList<>();
        int sortOrder = 0;

        for (ProductVariant variant : variants) {
            Optional<SaleCampaignDiscountTier> matchingTier = findMatchingTier(variant.getPrice(), sortedTiers);

            if (matchingTier.isPresent()) {
                SaleCampaignDiscountTier tier = matchingTier.get();
                BigDecimal salePrice = tier.calculateSalePrice(variant.getPrice());

                SaleCampaignItem item = SaleCampaignItem.builder()
                        .saleCampaign(saleCampaign)
                        .variant(variant)
                        .salePrice(salePrice)
                        .discountPercent(tier.getDiscountPercent())
                        .stockLimit(variant.getStock())
                        .soldCount(0)
                        .sortOrder(sortOrder++)
                        .build();

                items.add(item);
            } else {
                log.debug("Variant {} (price: {}) does not match any tier, skipping",
                        variant.getSku(), variant.getPrice());
            }
        }

        log.info("Generated {} items for campaign {}", items.size(), saleCampaign.getId());
        return items;
    }

    private Optional<SaleCampaignDiscountTier> findMatchingTier(
            BigDecimal price,
            List<SaleCampaignDiscountTier> tiers) {

        return tiers.stream()
                .filter(tier -> tier.matchesPrice(price))
                .findFirst();
    }
}
