package com.ecom.promotion.service.signature;

import com.ecom.promotion.dto.request.GenerateVoucherFromCampaignRequest;

/**
 * Service for handling campaign-to-voucher generation
 */
public interface CampaignVoucherService {

    /**
     * Generate vouchers from a sale campaign.
     * Creates auto-apply vouchers for each product/variant in the campaign.
     */
    void generateVouchersFromCampaign(GenerateVoucherFromCampaignRequest request);
}
