package com.ecom.product.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.product.dto.FlashSaleDTO;
import com.ecom.product.dto.FlashSaleItemDTO;
import com.ecom.product.service.signature.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/flash-sales")
@RequiredArgsConstructor
public class PublicFlashSaleController {

    private final FlashSaleService flashSaleService;


    @GetMapping("/active")
    public ResponseEntity<APIResponse<List<FlashSaleDTO>>> getActiveFlashSales() {
        List<FlashSaleDTO> flashSales = flashSaleService.getActiveFlashSales();
        return ResponseBuilder.success("Active flash sales retrieved successfully", flashSales);
    }


    @GetMapping("/{slug}")
    public ResponseEntity<APIResponse<FlashSaleDTO>> getFlashSaleBySlug(@PathVariable String slug) {
        FlashSaleDTO flashSale = flashSaleService.getFlashSaleBySlug(slug);
        return ResponseBuilder.success("Flash sale retrieved successfully", flashSale);
    }


    @GetMapping("/{slug}/items")
    public ResponseEntity<APIResponse<List<FlashSaleItemDTO>>> getFlashSaleItems(
            @PathVariable String slug,
            @RequestParam(defaultValue = "20") int limit) {
        List<FlashSaleItemDTO> items = flashSaleService.getFlashSaleItems(slug, limit);
        return ResponseBuilder.success("Flash sale items retrieved successfully", items);
    }


    @GetMapping("/variant/{variantId}/price")
    public ResponseEntity<APIResponse<FlashSaleItemDTO>> getFlashSalePriceForVariant(
            @PathVariable Long variantId) {
        return flashSaleService.getActiveFlashSalePrice(variantId)
                .map(item -> ResponseBuilder.success("Flash sale price found", item))
                .orElseGet(() -> ResponseBuilder.success("No active flash sale for this variant", null));
    }
}
