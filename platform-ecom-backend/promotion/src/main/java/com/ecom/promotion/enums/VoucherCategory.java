package com.ecom.promotion.enums;

/**
 * Category of voucher for stacking rules.
 * PRODUCT vouchers can stack with SHIPPING vouchers only.
 */
public enum VoucherCategory {
    PRODUCT, // Applies to product/variant/category prices
    SHIPPING // Applies to shipping fees
}
