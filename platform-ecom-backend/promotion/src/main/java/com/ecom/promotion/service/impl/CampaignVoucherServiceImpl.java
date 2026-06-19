package com.ecom.promotion.service.impl;

import com.ecom.promotion.dto.request.GenerateVoucherFromCampaignRequest;
import com.ecom.promotion.entity.ProductDiscountHistory;
import com.ecom.promotion.repository.DiscountHistoryRepository;
import com.ecom.promotion.service.signature.CampaignVoucherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CampaignVoucherServiceImpl implements CampaignVoucherService {

        private final DiscountHistoryRepository discountHistoryRepository;

        @Override
        @Transactional
        public void generateVouchersFromCampaign(GenerateVoucherFromCampaignRequest request) {
                log.info("Recording discount history for campaign: {} with {} items",
                                request.getCampaignId(), request.getItems().size());

                for (var item : request.getItems()) {
                        // Log to discount history for chatbot queries
                        ProductDiscountHistory history = ProductDiscountHistory.builder()
                                        .productId(item.getProductId())
                                        .variantId(item.getVariantId())
                                        .voucherId(null)
                                        .saleCampaignId(request.getCampaignId())
                                        .discountName(request.getCampaignName())
                                        .originalPrice(item.getOriginalPrice())
                                        .discountedPrice(item.getSalePrice())
                                        .discountPercent(item.getDiscountPercent())
                                        .startTime(request.getStartTime())
                                        .endTime(request.getEndTime())
                                        .build();
                        discountHistoryRepository.save(history);
                }
                log.info("Successfully recorded discount history for campaign {}", request.getCampaignId());
        }
}
