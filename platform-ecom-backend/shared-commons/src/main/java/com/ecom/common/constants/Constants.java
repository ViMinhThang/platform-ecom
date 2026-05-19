package com.ecom.common.constants;

/**
 * Application-wide constants.
 * Replaces magic strings and numbers across microservices.
 */
public final class Constants {

    private Constants() {
        // Prevent instantiation
    }

    // Pagination defaults
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_DIRECTION = "asc";
    public static final String DEFAULT_SORT_BY = "id";

    // Role names
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_SELLER = "ROLE_SELLER";

    // HTTP Headers
    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_ROLES = "X-Roles";
    public static final String HEADER_EMAIL = "X-User-Email";

    // File upload
    public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    public static final String[] ALLOWED_IMAGE_TYPES = { "image/jpeg", "image/png", "image/gif", "image/webp" };

    // Order statuses
    public static final String ORDER_STATUS_PENDING = "PENDING";
    public static final String ORDER_STATUS_CONFIRMED = "CONFIRMED";
    public static final String ORDER_STATUS_SHIPPED = "SHIPPED";
    public static final String ORDER_STATUS_DELIVERED = "DELIVERED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED";

    // Payment statuses
    public static final String PAYMENT_STATUS_PENDING = "PENDING";
    public static final String PAYMENT_STATUS_COMPLETED = "COMPLETED";
    public static final String PAYMENT_STATUS_FAILED = "FAILED";
}
