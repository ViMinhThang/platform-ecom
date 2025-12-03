/**
 * Centralized API Client
 * Provides a configured axios instance with automatic authentication and logging
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_ENDPOINTS } from '@/config/constants';
import { logger } from '@/lib/logger';
import { ApiError, NetworkError } from '@/lib/errors';
import { getSession } from 'next-auth/react';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - auto-inject auth token from session
apiClient.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        logger.apiRequest(
            config.method?.toUpperCase() || 'GET',
            config.url || '',
            { params: config.params }
        );
        return config;
    },
    (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
    }
);

// Response interceptor - logging and error handling
apiClient.interceptors.response.use(
    (response) => {
        logger.apiResponse(
            response.config.method?.toUpperCase() || 'GET',
            response.config.url || '',
            response.status
        );
        return response;
    },
    (error: AxiosError) => {
        logger.apiResponse(
            error.config?.method?.toUpperCase() || 'GET',
            error.config?.url || '',
            error.response?.status || 0,
            { error: error.message }
        );

        if (error.response) {
            const message = (error.response.data as any)?.message || error.message;
            return Promise.reject(new ApiError(message, error.response.status, error.response.data));
        } else if (error.request) {
            return Promise.reject(new NetworkError('No response from server'));
        } else {
            return Promise.reject(new NetworkError(error.message));
        }
    }
);

export default apiClient;
