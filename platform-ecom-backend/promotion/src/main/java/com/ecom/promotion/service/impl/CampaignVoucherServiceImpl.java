package com.ecom.promotion.service.impl;

import com.ecom.promotion.dto.request.GenerateVoucherFromCampaignRequest;
import com.ecom.promotion.entity.ProductDiscountHistory;
import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.entity.VoucherScope;
import com.ecom.promotion.enums.*;
import com.ecom.promotion.helper.VoucherHelper;
import com.ecom.promotion.repository.DiscountHistoryRepository;
import com.ecom.promotion.repository.VoucherRepository;
import com.ecom.promotion.service.signature.CampaignVoucherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CampaignVoucherServiceImpl implements CampaignVoucherService {

        private final VoucherRepository voucherRepository;
        private final DiscountHistoryRepository discountHistoryRepository;
        private final VoucherHelper voucherHelper;

        @Override
        @Transactional
        public void generateVouchersFromCampaign(GenerateVoucherFromCampaignRequest request) {
                log.info("Generating vouchers for campaign: {} with {} items",
                                request.getCampaignId(), request.getItems().size());

                // Create one auto-apply voucher for the entire campaign
                Voucher voucher = Voucher.builder()
                                .name(request.getCampaignName())
                                .description("Auto-generated from sale campaign: " + request.getCampaignName())
                                .type(VoucherType.PERCENTAGE)
                                .category(VoucherCategory.PRODUCT)
                                .applyMode(ApplyMode.AUTO)
                                .status(voucherHelper.determineStatus(request.getStartTime()))
                                .discountValue(voucherHelper.calculateAverageDiscount(request))
                                .startTime(request.getStartTime())
                                .endTime(request.getEndTime())
                                .saleCampaignId(request.getCampaignId())
                                .build();

                // Add scopes for each variant in the campaign
                for (var item : request.getItems()) {
                        VoucherScope scope = VoucherScope.builder()
                                        .scopeType(item.getVariantId() != null ? ScopeType.VARIANT : ScopeType.PRODUCT)
                                        .targetId(item.getVariantId() != null ? item.getVariantId()
                                                        : item.getProductId())
                                        .build();
                        voucher.addScope(scope);

                        // Log to discount history for chatbot queries
                        ProductDiscountHistory history = ProductDiscountHistory.builder()
                                        .productId(item.getProductId())
                                        .variantId(item.getVariantId())
                                        .voucherId(null) // Will be set after save
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

                Voucher saved = voucherRepository.save(voucher);
                log.info("Created voucher {} for campaign {} with {} scopes",
                                saved.getId(), request.getCampaignId(), saved.getScopes().size());
        }
}
