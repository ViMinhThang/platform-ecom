/**
 * Validation Utility Functions
 * Provides common validation helpers and type guards
 */

import { VALIDATION } from '@/config/constants';

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 */
export function isValidPassword(password: string): boolean {
    return (
        password.length >= VALIDATION.MIN_PASSWORD_LENGTH &&
        password.length <= VALIDATION.MAX_PASSWORD_LENGTH
    );
}

/**
 * Validates username format
 */
export function isValidUsername(username: string): boolean {
    return (
        username.length >= VALIDATION.MIN_USERNAME_LENGTH &&
        username.length <= VALIDATION.MAX_USERNAME_LENGTH &&
        /^[a-zA-Z0-9_-]+$/.test(username)
    );
}

/**
 * Type guard to check if value is not null or undefined
 */
export function isNotEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Type guard to check if value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
    return isValidNumber(value) && value > 0;
}

/**
 * Type guard to check if array is not empty
 */
export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
    return Array.isArray(value) && value.length > 0;
}

/**
 * Validates file size
 */
export function isValidFileSize(fileSize: number, maxSizeBytes: number): boolean {
    return fileSize > 0 && fileSize <= maxSizeBytes;
}

/**
 * Validates file type
 */
export function isValidFileType(fileType: string, allowedTypes: readonly string[]): boolean {
    return allowedTypes.includes(fileType);
}

/**
 * Sanitizes string input (basic XSS prevention)
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Type guard for exhaustive switch statements
 */
export function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if string is a valid JSON
 */
export function isValidJson(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}
