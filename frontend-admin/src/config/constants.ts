/**
 * Application-wide constants
 * Centralizes all magic numbers, strings, and configuration values
 */

// API Configuration
export const API_ENDPOINTS = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    // Products
    PRODUCTS_PUBLIC: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/products`,
    PRODUCTS_SELLER: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/sellers/products`,
    PRODUCTS_ADMIN: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/admin/products`,

    // Categories
    CATEGORIES_PUBLIC: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/categories`,
    CATEGORIES_ADMIN: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/admin/categories`,

    // Users & Auth
    USERS: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/users`,
    ADMIN_USERS: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/admin/users`,
    AUTH: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/auth`,
    ADMIN_ROLES: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/admin/roles`,
} as const;

// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_SIZE: 100,
} as const;

// Product Status
export const PRODUCT_STATUS = {
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;

export type ProductStatus = typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

// Application Routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    DASHBOARD_OVERVIEW: '/dashboard/overview',
    PRODUCTS: '/dashboard/product',
    CATEGORIES: '/dashboard/category',
    USERS: '/dashboard/user',
    KANBAN: '/dashboard/kanban',
    PROFILE: '/dashboard/profile',
    AUTH_SIGN_IN: '/auth/sign-in',
    AUTH_SIGN_UP: '/auth/sign-up',
} as const;

// UI Constants
export const UI = {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 200,
} as const;

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

// Validation
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 100,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
    MIN_PRODUCT_NAME_LENGTH: 3,
    MAX_PRODUCT_NAME_LENGTH: 200,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// User Roles
export const USER_ROLES = {
    ADMIN: 'ROLE_ADMIN',
    SELLER: 'ROLE_SELLER',
    USER: 'ROLE_USER',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
