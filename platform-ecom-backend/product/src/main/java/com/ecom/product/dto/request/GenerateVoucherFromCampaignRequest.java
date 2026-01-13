package com.ecom.product.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Request to generate vouchers from a sale campaign
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateVoucherFromCampaignRequest {
    private Long campaignId;
    private String campaignName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<VoucherItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VoucherItemRequest {
        private Long productId;
        private Long variantId;
        private Long categoryId;
        private BigDecimal originalPrice;
        private BigDecimal salePrice;
        private Integer discountPercent;
        private Integer stockLimit;
    }
}
