package com.ecom.promotion.helper;

import com.ecom.promotion.dto.DiscountHistoryDTO;
import com.ecom.promotion.entity.ProductDiscountHistory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DiscountHistoryHelper {

    public DiscountHistoryDTO toDTO(ProductDiscountHistory history) {
        LocalDateTime now = LocalDateTime.now();
        boolean isActive = now.isAfter(history.getStartTime()) && now.isBefore(history.getEndTime());

        return DiscountHistoryDTO.builder()
                .id(history.getId())
                .productId(history.getProductId())
                .variantId(history.getVariantId())
                .discountName(history.getDiscountName())
                .originalPrice(history.getOriginalPrice())
                .discountedPrice(history.getDiscountedPrice())
                .discountPercent(history.getDiscountPercent())
                .startTime(history.getStartTime())
                .endTime(history.getEndTime())
                .isActive(isActive)
                .build();
    }
}
