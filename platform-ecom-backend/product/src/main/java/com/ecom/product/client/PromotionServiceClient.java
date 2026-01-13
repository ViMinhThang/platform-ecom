package com.ecom.product.client;

import com.ecom.common.util.APIResponse;
import com.ecom.product.dto.request.GenerateVoucherFromCampaignRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

/**
 * Client for communicating with Promotion Service
 */
@HttpExchange
public interface PromotionServiceClient {

    Logger log = LoggerFactory.getLogger(PromotionServiceClient.class);

    @PostExchange("/vouchers/from-campaign")
    APIResponse<Void> generateVouchersFromCampaign(@RequestBody GenerateVoucherFromCampaignRequest request);

    default boolean generateVouchersFromCampaignSafe(GenerateVoucherFromCampaignRequest request) {
        try {
            APIResponse<Void> response = generateVouchersFromCampaign(request);
            if (response != null && response.isSuccess()) {
                log.info("Generated vouchers for campaign: {}", request.getCampaignId());
                return true;
            }
        } catch (Exception e) {
            log.error("Error generating vouchers for campaign: {}", request.getCampaignId(), e);
        }
        return false;
    }
}
