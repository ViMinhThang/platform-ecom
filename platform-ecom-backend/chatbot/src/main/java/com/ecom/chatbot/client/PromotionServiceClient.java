package com.ecom.chatbot.client;

import com.ecom.chatbot.dto.DiscountHistoryDTO;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

import java.util.List;

/**
 * Client for calling Promotion Service discount history APIs
 */
public interface PromotionServiceClient {

    @GetExchange("/discount-history/product/{productId}")
    ApiResponseWrapper<List<DiscountHistoryDTO>> getProductDiscountHistory(
            @PathVariable("productId") Long productId);

    @GetExchange("/discount-history/product/{productId}/best")
    ApiResponseWrapper<DiscountHistoryDTO> getBestDiscount(
            @PathVariable("productId") Long productId);

    @GetExchange("/discount-history/product/{productId}/recent")
    ApiResponseWrapper<List<DiscountHistoryDTO>> getRecentDiscounts(
            @PathVariable("productId") Long productId,
            @RequestParam(value = "days", required = false) Integer days);

    @GetExchange("/discount-history/top")
    ApiResponseWrapper<List<DiscountHistoryDTO>> getTopDiscountedProducts(
            @RequestParam(value = "limit", required = false) Integer limit);
}
