package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.SaleCampaignDTO;
import com.ecom.product.dto.SaleCampaignItemDTO;
import com.ecom.product.service.signature.SaleCampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    public ResponseEntity<APIResponse<Page<SaleCampaignItemDTO>>> getSaleCampaignItems(
            @PathVariable String slug,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "sortOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<SaleCampaignItemDTO> items = saleCampaignService.getSaleCampaignItems(slug, minPrice, maxPrice, inStockOnly, pageable);
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
