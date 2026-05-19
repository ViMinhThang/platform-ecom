package com.ecom.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Status for individual Sub-Orders (per seller)
 * Aligned with GHN shipping statuses
 */
@Getter
@RequiredArgsConstructor
public enum SubOrderStatus {
    // Pre-shipping
    PENDING("Awaiting confirmation"),
    PROCESSING("Seller preparing items"), // Legacy - maps to READY_TO_PICK
    READY_TO_PICK("Ready for pickup"),
    PICKING("Shipper picking up"),
    PICKED("Goods picked up"),

    // In transit
    SHIPPED("Items shipped"), // Legacy - maps to TRANSPORTING
    STORING("At GHN hub"),
    TRANSPORTING("In transit"),
    SORTING("At sorting facility"),
    DELIVERING("Out for delivery"),

    // Completed
    DELIVERED("Delivered"),

    // Failed/Return
    DELIVERY_FAIL("Delivery failed"),
    WAITING_TO_RETURN("Awaiting return"),
    RETURNING("Being returned"),
    RETURNED("Returned to seller"),

    // Cancelled/Exceptions
    CANCELLED("Cancelled"),
    REFUND_PENDING("Refund requested"),
    REFUNDED("Refunded"),
    EXCEPTION("Exception handling"),
    LOST("Package lost"),
    DAMAGE("Package damaged");

    private final String description;

    /**
     * Map GHN status string to SubOrderStatus enum
     */
    public static SubOrderStatus fromGhnStatus(String ghnStatus) {
        if (ghnStatus == null)
            return PENDING;

        return switch (ghnStatus.toLowerCase()) {
            case "ready_to_pick" -> READY_TO_PICK;
            case "picking", "money_collect_picking" -> PICKING;
            case "picked" -> PICKED;
            case "storing" -> STORING;
            case "transporting" -> TRANSPORTING;
            case "sorting" -> SORTING;
            case "delivering", "money_collect_delivering" -> DELIVERING;
            case "delivered" -> DELIVERED;
            case "delivery_fail" -> DELIVERY_FAIL;
            case "waiting_to_return" -> WAITING_TO_RETURN;
            case "return", "return_transporting", "return_sorting", "returning", "return_fail" -> RETURNING;
            case "returned" -> RETURNED;
            case "cancel" -> CANCELLED;
            case "exception" -> EXCEPTION;
            case "lost" -> LOST;
            case "damage" -> DAMAGE;
            default -> PENDING;
        };
    }
}
