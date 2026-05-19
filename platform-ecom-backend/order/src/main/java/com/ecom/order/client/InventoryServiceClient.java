package com.ecom.order.client;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.Map;

/**
 * Client for communicating with Inventory Service.
 * Used for stock validation and reservation during checkout.
 */
@HttpExchange
public interface InventoryServiceClient {

    /**
     * Check if stock is available for a single variant
     */
    @GetExchange("/check/{variantId}")
    boolean checkStock(@PathVariable("variantId") Long variantId, 
                       @RequestParam("quantity") int quantity);

    /**
     * Bulk check stock availability for multiple variants
     * @param items Map of variantId -> quantity
     * @return Map of variantId -> isAvailable
     */
    @PostExchange("/check")
    Map<Long, Boolean> checkStockBulk(@RequestBody Map<Long, Integer> items);

    /**
     * Reserve stock for checkout
     */
    @PostExchange("/reserve")
    StockReservationResponse reserve(@RequestBody ReservationRequest request);

    /**
     * Confirm reservation after payment success
     */
    @PostExchange("/confirm/{reservationId}")
    void confirmReservation(@PathVariable("reservationId") Long reservationId);

    /**
     * Cancel/release reservation
     */
    @PostExchange("/release/{reservationId}")
    void cancelReservation(@PathVariable("reservationId") Long reservationId);

    /**
     * DTO for reservation request
     */
    record ReservationRequest(
            Long variantId,
            Integer quantity,
            Long cartId,
            Long userId,
            Integer durationMinutes
    ) {}

    /**
     * DTO for reservation response
     */
    record StockReservationResponse(
            Long id,
            Long inventoryId,
            Long variantId,
            Integer quantity,
            String status,
            String expiresAt
    ) {}
}
