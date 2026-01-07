package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.SaleCampaignDTO;
import com.ecom.product.dto.SaleCampaignItemDTO;
import com.ecom.product.service.signature.SaleCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sale-campaigns")
@RequiredArgsConstructor
public class PublicSaleCampaignController {

    private final SaleCampaignService saleCampaignService;

    @GetMapping("/active")
    public ResponseEntity<APIResponse<List<SaleCampaignDTO>>> getActiveSaleCampaigns() {
        List<SaleCampaignDTO> campaigns = saleCampaignService.getActiveSaleCampaigns();
        return ResponseBuilder.success("Active sale campaigns retrieved successfully", campaigns);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<APIResponse<SaleCampaignDTO>> getSaleCampaignBySlug(@PathVariable String slug) {
        SaleCampaignDTO campaign = saleCampaignService.getSaleCampaignBySlug(slug);
        return ResponseBuilder.success("Sale campaign retrieved successfully", campaign);
    }

    @GetMapping("/{slug}/items")
    public ResponseEntity<APIResponse<List<SaleCampaignItemDTO>>> getSaleCampaignItems(
            @PathVariable String slug,
            @RequestParam(defaultValue = "20") int limit) {
        List<SaleCampaignItemDTO> items = saleCampaignService.getSaleCampaignItems(slug, limit);
        return ResponseBuilder.success("Sale campaign items retrieved successfully", items);
    }

    @GetMapping("/variant/{variantId}/price")
    public ResponseEntity<APIResponse<SaleCampaignItemDTO>> getSalePriceForVariant(
            @PathVariable Long variantId) {
        return saleCampaignService.getActiveSalePrice(variantId)
                .map(item -> ResponseBuilder.success("Sale price found", item))
                .orElseGet(() -> ResponseBuilder.success("No active sale for this variant", null));
    }
}
