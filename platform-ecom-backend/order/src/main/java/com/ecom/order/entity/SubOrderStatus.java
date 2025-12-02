package com.ecom.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Status for individual Sub-Orders (per seller)
 */
@Getter
@RequiredArgsConstructor
public enum SubOrderStatus {
    PENDING("Awaiting seller confirmation"),
    PROCESSING("Seller preparing items"),
    SHIPPED("Items shipped"),
    DELIVERED("Items delivered"),
    CANCELLED("Sub-order cancelled"),
    REFUND_PENDING("Refund requested"),
    REFUNDED("Sub-order refunded");

    private final String description;
}
