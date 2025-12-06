package com.ecom.inventory.controller;

import com.ecom.inventory.dto.*;
import com.ecom.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Internal endpoints for service-to-service communication.
 * Not exposed through gateway.
 */
@RestController
@RequestMapping("/internal/inventory")
@RequiredArgsConstructor
public class InternalInventoryController {

    private final InventoryService inventoryService;

    /**
     * Bulk check stock availability
     */
    @PostMapping("/check")
    public Map<Long, Boolean> checkStockBulk(@Valid @RequestBody StockCheckRequest request) {
        return inventoryService.checkStockBulk(request.getItems());
    }

    /**
     * Reserve stock for checkout
     */
    @PostMapping("/reserve")
    public StockReservationDTO reserve(@Valid @RequestBody ReservationRequest request) {
        return inventoryService.reserve(request);
    }

    /**
     * Confirm reservation (order confirmed)
     */
    @PostMapping("/confirm/{reservationId}")
    public void confirmReservation(@PathVariable Long reservationId) {
        inventoryService.confirmReservation(reservationId);
    }

    /**
     * Cancel/release reservation
     */
    @PostMapping("/release/{reservationId}")
    public void cancelReservation(@PathVariable Long reservationId) {
        inventoryService.cancelReservation(reservationId);
    }

    /**
     * Check single item stock
     */
    @GetMapping("/check/{variantId}")
    public boolean checkStock(@PathVariable Long variantId, @RequestParam int quantity) {
        return inventoryService.checkStock(variantId, quantity);
    }

    /**
     * Get inventory by variant (internal)
     */
    @GetMapping("/{variantId}")
    public InventoryDTO getByVariantId(@PathVariable Long variantId) {
        return inventoryService.getByVariantId(variantId);
    }
}
