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
    REQUIRED_FIELD: 'Trường này là bắt buộc',
    INVALID_EMAIL: 'Địa chỉ email không hợp lệ',
    ADDRESS_LIMIT_REACHED: 'Bạn chỉ có thể có tối đa 5 địa chỉ',
    IMAGE_TYPE_INVALID: 'Vui lòng tải lên tệp hình ảnh',
    IMAGE_SIZE_TOO_LARGE: 'Kích thước ảnh phải nhỏ hơn 5MB',
} as const;

export const ORDER_STATUSES = {
    DELIVERED: 'delivered',
    SHIPPED: 'shipped',
    PROCESSING: 'processing',
    CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

// Admin Constants (merged from frontend-admin)
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_SIZE: 100,
} as const;

export const PRODUCT_STATUS = {
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/(admin)/dashboard',
    DASHBOARD_OVERVIEW: '/(admin)/dashboard/overview',
    PRODUCTS: '/(admin)/dashboard/product',
    CATEGORIES: '/(admin)/dashboard/category',
    USERS: '/(admin)/dashboard/user',
    ORDERS: '/(admin)/dashboard/orders',
    INVENTORY: '/(admin)/dashboard/inventory',
    REVIEWS: '/(admin)/dashboard/reviews',
    SALE_CAMPAIGNS: '/(admin)/dashboard/sale-campaigns',
    VOUCHERS: '/(admin)/dashboard/vouchers',
    PROFILE: '/(admin)/dashboard/profile',
    AUTH_SIGN_IN: '/auth/sign-in',
    AUTH_SIGN_UP: '/auth/register',
} as const;

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERING: 'DELIVERING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    RETURNED: 'RETURNED',
    REFUNDED: 'REFUNDED',
} as const;

export const CAMPAIGN_STATUS = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export const FILE_UPLOAD = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

export const USER_ROLES = {
    ADMIN: 'ROLE_ADMIN',
    SELLER: 'ROLE_SELLER',
    USER: 'ROLE_USER',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
