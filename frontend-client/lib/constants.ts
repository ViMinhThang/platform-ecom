/**
 * Application-wide constants
 * Centralized location for magic numbers, limits, and configuration values
 */

export const LIMITS = {
    MAX_ADDRESSES: 5,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ORDERS_PER_PAGE: 10,
    REVIEW_MIN_LENGTH: 10,
    REVIEW_MAX_LENGTH: 1000,
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 6,
    STREET_MIN_LENGTH: 5,
    BUILDING_NAME_MIN_LENGTH: 2,
} as const;

export const FILE_TYPES = {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
} as const;

export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email address',
    ADDRESS_LIMIT_REACHED: 'You can only have a maximum of 5 addresses',
    IMAGE_TYPE_INVALID: 'Please upload an image file',
    IMAGE_SIZE_TOO_LARGE: 'Image size should be less than 5MB',
} as const;

export const ORDER_STATUSES = {
    DELIVERED: 'delivered',
    SHIPPED: 'shipped',
    PROCESSING: 'processing',
    CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];
