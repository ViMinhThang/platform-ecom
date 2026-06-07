/**
 * Custom Error Classes
 * Provides type-safe error handling throughout the application
 */

import { logger } from './logger';

/**
 * Base application error class
 */
export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
        public readonly statusCode?: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * API-related errors
 */
export class ApiError extends ApplicationError {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly data?: unknown
    ) {
        super(message, 'API_ERROR', statusCode);
    }
}

/**
 * Validation errors
 */
export class ValidationError extends ApplicationError {
    constructor(
        message: string,
        public readonly field?: string,
        public readonly errors?: Record<string, string[]>
    ) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends ApplicationError {
    constructor(message: string = 'Cần đăng nhập để tiếp tục') {
        super(message, 'AUTH_ERROR', 401);
    }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends ApplicationError {
    constructor(message: string = 'Bạn không có đủ quyền để thực hiện thao tác này') {
        super(message, 'AUTHORIZATION_ERROR', 403);
    }
}

/**
 * Not found errors
 */
export class NotFoundError extends ApplicationError {
    constructor(resource: string, identifier?: string | number) {
        const message = identifier
            ? `Không tìm thấy ${resource} với mã định danh ${identifier}`
            : `Không tìm thấy ${resource}`;
        super(message, 'NOT_FOUND_ERROR', 404);
    }
}

/**
 * Network errors
 */
export class NetworkError extends ApplicationError {
    constructor(message: string = 'Yêu cầu mạng không thành công') {
        super(message, 'NETWORK_ERROR');
    }
}

/**
 * Type guard to check if error is an ApplicationError
 */
export function isApplicationError(error: unknown): error is ApplicationError {
    return error instanceof ApplicationError;
}

/**
 * Handles errors and converts them to ApplicationError instances
 */
export function handleError(error: unknown): ApplicationError {
    // Already an ApplicationError
    if (isApplicationError(error)) {
        logger.error(error.message, error);
        return error;
    }

    // Standard Error
    if (error instanceof Error) {
        logger.error('Unexpected error', error);
        return new ApplicationError(error.message);
    }

    // Unknown error type
    logger.error('Unknown error occurred', undefined, { error });
    return new ApplicationError('Đã xảy ra lỗi không xác định');
}

/**
 * Extracts a user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
    if (isApplicationError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Đã xảy ra lỗi ngoài dự kiến';
}

/**
 * Checks if an error should be retried
 */
export function isRetryableError(error: unknown): boolean {
    if (!isApplicationError(error)) {
        return false;
    }

    // Retry on network errors or 5xx status codes
    return (
        error instanceof NetworkError ||
        (error.statusCode !== undefined && error.statusCode >= 500)
    );
}
