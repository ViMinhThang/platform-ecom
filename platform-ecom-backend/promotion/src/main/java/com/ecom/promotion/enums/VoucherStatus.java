package com.ecom.promotion.enums;

/**
 * Lifecycle status of a voucher
 */
public enum VoucherStatus {
    DRAFT, // Not yet active
    SCHEDULED, // Scheduled for future activation
    ACTIVE, // Currently usable
    EXPIRED, // Past end time
    CANCELLED // Manually cancelled
}
