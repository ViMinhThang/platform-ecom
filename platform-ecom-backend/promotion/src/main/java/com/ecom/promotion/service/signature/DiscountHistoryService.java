package com.ecom.promotion.service.signature;

import com.ecom.promotion.dto.DiscountHistoryDTO;

import java.util.List;

/**
 * Service for querying discount history - used by chatbot
 */
public interface DiscountHistoryService {

    /**
     * Get discount history for a product
     */
    List<DiscountHistoryDTO> getProductDiscountHistory(Long productId);

    /**
     * Get best discount ever for a product
     */
    DiscountHistoryDTO getBestDiscountForProduct(Long productId);

    /**
     * Get recent discounts in the past N days
     */
    List<DiscountHistoryDTO> getRecentDiscounts(Long productId, int days);

    /**
     * Get top discounted products in a time period
     */
    List<DiscountHistoryDTO> getTopDiscountedProducts(int limit);
}
