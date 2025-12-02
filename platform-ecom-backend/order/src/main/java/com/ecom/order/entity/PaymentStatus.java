package com.ecom.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Payment status for transactions and refunds
 */
@Getter
@RequiredArgsConstructor
public enum PaymentStatus {
    PENDING("Payment not initiated"),
    PROCESSING("Payment in progress"),
    SUCCEEDED("Payment successful"),
    FAILED("Payment failed"),
    CANCELLED("Payment cancelled"),
    PARTIALLY_REFUNDED("Some items refunded"),
    FULLY_REFUNDED("Full refund completed");

    private final String description;
}
