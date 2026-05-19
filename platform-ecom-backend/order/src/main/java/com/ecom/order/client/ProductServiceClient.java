package com.ecom.order.client;

import com.ecom.common.util.APIResponse;
import com.ecom.order.dto.ProductDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.math.BigDecimal;

/**
 * Client for communicating with Product Service
 */
@HttpExchange
public interface ProductServiceClient {

    Logger log = LoggerFactory.getLogger(ProductServiceClient.class);

    /**
     * Get product details
     */
    @GetExchange("/{productId}/variants/{variantId}")
    APIResponse<ProductDetails> getProductDetails(@PathVariable("productId") Long productId,
            @PathVariable("variantId") Long variantId);

    /**
     * Get product price
     */
    default BigDecimal getProductPrice(Long productId, Long variantId) {
        try {
            APIResponse<ProductDetails> response = getProductDetails(productId, variantId);
            if (response != null && response.isSuccess() && response.getData() != null) {
                return response.getData().getPrice();
            }
        } catch (Exception e) {
            log.error("Error fetching product price for productId: {}, variantId: {}", productId, variantId, e);
        }
        return null;
    }

    /**
     * Validate stock availability
     */
    default boolean validateStock(Long productId, Long variantId, Integer quantity) {
        try {
            APIResponse<ProductDetails> response = getProductDetails(productId, variantId);
            if (response != null && response.isSuccess() && response.getData() != null) {
                ProductDetails details = response.getData();
                if (details.getStockQuantity() != null) {
                    return details.getStockQuantity() >= quantity;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error validating stock for productId: {}, variantId: {}", productId, variantId, e);
            return false;
        }
    }
}
