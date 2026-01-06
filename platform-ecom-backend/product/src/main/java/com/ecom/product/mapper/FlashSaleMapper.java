package com.ecom.product.mapper;

import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.FlashSaleItemDTO;
import com.ecom.product.entity.FlashSale;
import com.ecom.product.entity.FlashSaleItem;
import com.ecom.product.entity.Product;
import com.ecom.product.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class FlashSaleMapper {

    public FlashSaleDTO toDTO(FlashSale flashSale) {
        return toDTO(flashSale, false);
    }


    public FlashSaleDTO toDTO(FlashSale flashSale, boolean includeItems) {
        if (flashSale == null) return null;

        FlashSaleDTO.FlashSaleDTOBuilder builder = FlashSaleDTO.builder()
                .id(flashSale.getId())
                .name(flashSale.getName())
                .slug(flashSale.getSlug())
                .description(flashSale.getDescription())
                .bannerUrl(flashSale.getBannerUrl())
                .status(flashSale.getStatus().name())
                .startTime(flashSale.getStartTime())
                .endTime(flashSale.getEndTime())
                .totalItems(flashSale.getItems() != null ? flashSale.getItems().size() : 0)
                .remainingSeconds(flashSale.getRemainingSeconds())
                .createdAt(flashSale.getCreatedAt())
                .updatedAt(flashSale.getUpdatedAt());

        if (includeItems && flashSale.getItems() != null) {
            builder.items(flashSale.getItems().stream()
                    .map(this::toItemDTO)
                    .collect(Collectors.toList()));
        }

        return builder.build();
    }

    public FlashSaleItemDTO toItemDTO(FlashSaleItem item) {
        if (item == null) return null;

        ProductVariant variant = item.getVariant();
        Product product = variant != null ? variant.getProduct() : null;

        return FlashSaleItemDTO.builder()
                .id(item.getId())
                .variantId(variant != null ? variant.getId() : null)
                .productId(product != null ? product.getId() : null)
                .productName(product != null ? product.getName() : null)
                .productSlug(product != null ? product.getSlug() : null)
                .variantSku(variant != null ? variant.getSku() : null)
                .imageUrl(variant != null ? variant.getImageUrl() : null)
                .originalPrice(variant != null ? variant.getPrice() : null)
                .flashSalePrice(item.getFlashSalePrice())
                .discountPercent(item.getDiscountPercent())
                .stockLimit(item.getStockLimit())
                .soldCount(item.getSoldCount())
                .remainingStock(item.getRemainingStock())
                .sortOrder(item.getSortOrder())
                .isAvailable(item.isAvailable())
                .build();
    }


    public List<FlashSaleDTO> toDTOList(List<FlashSale> flashSales) {
        if (flashSales == null) return Collections.emptyList();
        return flashSales.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    public List<FlashSaleItemDTO> toItemDTOList(List<FlashSaleItem> items) {
        if (items == null) return Collections.emptyList();
        return items.stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());
    }
}
