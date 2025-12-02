import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from './logger';
import { ApiError, NetworkError } from './errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
});

// Request interceptor to log and add auth token
apiClient.interceptors.request.use(
    (config) => {
        // Log API request in development
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

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
    (response) => {
        // Log API response in development
        logger.apiResponse(
            response.config.method?.toUpperCase() || 'GET',
            response.config.url || '',
            response.status
        );
        return response;
    },
    (error: AxiosError) => {
        // Log the error
        logger.apiResponse(
            error.config?.method?.toUpperCase() || 'GET',
            error.config?.url || '',
            error.response?.status || 0,
            { error: error.message }
        );

        // Convert to appropriate error type
        if (error.response) {
            // Server responded with error
            const message = (error.response.data as any)?.message || error.message;
            return Promise.reject(new ApiError(message, error.response.status, error.response.data));
        } else if (error.request) {
            // Request made but no response
            return Promise.reject(new NetworkError('No response from server'));
        } else {
            // Something else happened
            return Promise.reject(new NetworkError(error.message));
        }
    }
);

export default apiClient;
