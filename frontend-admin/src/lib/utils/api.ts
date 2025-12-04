/**
 * API Utility Functions
 * Provides common API-related helper functions
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '@/config/constants';
import { ApiError, NetworkError, handleError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { APIResponse } from '@/types/api-response';

/**
 * Builds a complete API URL from endpoint and parameters
 */
export function buildApiUrl(
    endpoint: string,
    params?: Record<string, unknown>
): string {
    const baseUrl = API_ENDPOINTS.BASE_URL;
    const url = new URL(endpoint, baseUrl);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

/**
 * Creates standard request configuration with authentication
 */
export function createRequestConfig(token: string): AxiosRequestConfig {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
}

/**
 * Creates request configuration for multipart form data
 */
export function createMultipartConfig(token: string): AxiosRequestConfig {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    };
}

/**
 * Handles API errors and converts them to typed errors
 */
export function handleApiError(error: unknown): never {
    // Network error (no response received)
    if (axios.isAxiosError(error) && !error.response) {
        logger.error('Network error occurred', error);
        throw new NetworkError('Unable to connect to the server');
    }

    // API error (response received with error status)
    if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        const message = extractErrorMessage(data);

        logger.apiResponse(
            error.config?.method?.toUpperCase() || 'UNKNOWN',
            error.config?.url || 'unknown',
            status,
            { data }
        );

        throw new ApiError(message, status, data);
    }

    // Unknown error
    throw handleError(error);
}

/**
 * Extracts error message from API response data
 */
function extractErrorMessage(data: unknown): string {
    if (typeof data === 'string') {
        return data;
    }

    if (data && typeof data === 'object') {
        const errorData = data as Record<string, unknown>;

        if (typeof errorData.message === 'string') {
            return errorData.message;
        }

        if (typeof errorData.error === 'string') {
            return errorData.error;
        }
    }

    return 'An error occurred while processing your request';
}

/**
 * Type guard to check if error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
}

/**
 * Unwraps APIResponse wrapper and extracts data
 * @throws Error if response status is false
 */
export function unwrapResponse<T>(axiosResponse: { data: APIResponse<T> }): T {
    const apiResponse = axiosResponse.data;

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Operation failed');
    }

    return apiResponse.data;
}

/**
 * Extracts success message from wrapped response
 */
export function extractMessage<T>(axiosResponse: { data: APIResponse<T> }): string {
    return axiosResponse.data.message;
}
