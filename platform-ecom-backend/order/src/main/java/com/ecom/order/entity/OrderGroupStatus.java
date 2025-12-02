package com.ecom.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Status for Order Group (overall checkout transaction)
 */
@Getter
@RequiredArgsConstructor
public enum OrderGroupStatus {
    PENDING("Group created, awaiting payment"),
    PAYMENT_PENDING("Payment initiated"),
    PAID("Payment confirmed"),
    PAYMENT_FAILED("Payment failed"),
    PROCESSING("All sub-orders processing"),
    PARTIALLY_SHIPPED("Some sub-orders shipped"),
    COMPLETED("All sub-orders delivered"),
    CANCELLED("Group cancelled"),
    PARTIALLY_REFUNDED("Some sub-orders refunded"),
    FULLY_REFUNDED("All sub-orders refunded");

    private final String description;
}
