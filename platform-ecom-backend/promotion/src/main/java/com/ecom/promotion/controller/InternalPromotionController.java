package com.ecom.promotion.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.promotion.dto.request.GenerateVoucherFromCampaignRequest;
import com.ecom.promotion.service.signature.CampaignVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal API for service-to-service communication
 */
@RestController
@RequestMapping("/api/v1/internal/promotion")
@RequiredArgsConstructor
public class InternalPromotionController {

    private final CampaignVoucherService campaignVoucherService;

    @PostMapping("/vouchers/from-campaign")
    public ResponseEntity<APIResponse<Void>> generateVouchersFromCampaign(
            @RequestBody GenerateVoucherFromCampaignRequest request) {
        campaignVoucherService.generateVouchersFromCampaign(request);
        return ResponseBuilder.success("Vouchers generated from campaign", null);
    }
}
