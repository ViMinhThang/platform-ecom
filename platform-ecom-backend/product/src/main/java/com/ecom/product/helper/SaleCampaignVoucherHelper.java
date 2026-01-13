package com.ecom.product.helper;

import com.ecom.product.client.PromotionServiceClient;
import com.ecom.product.dto.request.GenerateVoucherFromCampaignRequest;
import com.ecom.product.entity.ProductVariant;
import com.ecom.product.entity.SaleCampaign;
import com.ecom.product.entity.SaleCampaignItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SaleCampaignVoucherHelper {

    private final PromotionServiceClient promotionServiceClient;

    public void generateVouchersForCampaign(SaleCampaign saleCampaign, List<SaleCampaignItem> items) {
        try {
            List<GenerateVoucherFromCampaignRequest.VoucherItemRequest> voucherItems = items.stream()
                    .map(item -> {
                        ProductVariant variant = item.getVariant();
                        return GenerateVoucherFromCampaignRequest.VoucherItemRequest.builder()
                                .productId(variant.getProduct().getId())
                                .variantId(variant.getId())
                                .categoryId(variant.getProduct().getCategory() != null
                                        ? variant.getProduct().getCategory().getId()
                                        : null)
                                .originalPrice(variant.getPrice())
                                .salePrice(item.getSalePrice())
                                .discountPercent(item.getDiscountPercent())
                                .stockLimit(item.getStockLimit())
                                .build();
                    })
                    .toList();

            GenerateVoucherFromCampaignRequest request = GenerateVoucherFromCampaignRequest.builder()
                    .campaignId(saleCampaign.getId())
                    .campaignName(saleCampaign.getName())
                    .startTime(saleCampaign.getStartTime())
                    .endTime(saleCampaign.getEndTime())
                    .items(voucherItems)
                    .build();

            promotionServiceClient.generateVouchersFromCampaignSafe(request);
        } catch (Exception e) {
            log.error("Failed to generate vouchers for campaign {}: {}", saleCampaign.getId(), e.getMessage());
        }
    }
}
