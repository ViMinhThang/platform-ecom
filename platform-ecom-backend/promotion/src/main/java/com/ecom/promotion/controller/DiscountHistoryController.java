package com.ecom.promotion.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.promotion.dto.DiscountHistoryDTO;
import com.ecom.promotion.service.signature.DiscountHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API for discount history - used by chatbot
 */
@RestController
@RequestMapping("/api/v1/discount-history")
@RequiredArgsConstructor
public class DiscountHistoryController {

    private final DiscountHistoryService discountHistoryService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<APIResponse<List<DiscountHistoryDTO>>> getProductHistory(
            @PathVariable Long productId) {
        List<DiscountHistoryDTO> history = discountHistoryService.getProductDiscountHistory(productId);
        return ResponseBuilder.success("Discount history retrieved", history);
    }

    @GetMapping("/product/{productId}/best")
    public ResponseEntity<APIResponse<DiscountHistoryDTO>> getBestDiscount(
            @PathVariable Long productId) {
        DiscountHistoryDTO best = discountHistoryService.getBestDiscountForProduct(productId);
        return ResponseBuilder.success("Best discount retrieved", best);
    }

    @GetMapping("/product/{productId}/recent")
    public ResponseEntity<APIResponse<List<DiscountHistoryDTO>>> getRecentDiscounts(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "30") int days) {
        List<DiscountHistoryDTO> discounts = discountHistoryService.getRecentDiscounts(productId, days);
        return ResponseBuilder.success("Recent discounts retrieved", discounts);
    }

    @GetMapping("/top")
    public ResponseEntity<APIResponse<List<DiscountHistoryDTO>>> getTopDiscountedProducts(
            @RequestParam(defaultValue = "10") int limit) {
        List<DiscountHistoryDTO> top = discountHistoryService.getTopDiscountedProducts(limit);
        return ResponseBuilder.success("Top discounted products retrieved", top);
    }
}
