/**
 * Environment configuration
 * Centralized environment variables for the application
 */

export const env = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    uploadsBaseUrl: process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:8080/uploads',
} as const;
