import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from './logger';
import { ApiError, NetworkError } from './errors';
import { env } from './config/env';
import { getSession } from 'next-auth/react';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        if (config.url?.startsWith('/v1/')) {
            config.url = '/api' + config.url;
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
