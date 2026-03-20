import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';
import { role, User } from '@/types/admin/user/user';

/**
 * Query parameters for fetching users
 */
export interface UserQueryParams {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}

/**
 * Paginated users response
 */
export interface PaginatedUsers {
    content: User[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}

/**
 * User Service
 * Handles all user-related API calls
 * Base endpoint: /api/v1/admin/users
 */
export const userService = {
    /**
     * Fetch paginated users with optional filters
     */
    async getUsers(params?: UserQueryParams): Promise<PaginatedUsers> {
        const response = await apiClient.get<APIResponse<PaginatedUsers>>(
            '/api/v1/admin/users',
            { params }
        );
        return response.data.data;
    },

    /**
     * Fetch a single user by ID
     */
    async getUserById(id: number): Promise<User> {
        const response = await apiClient.get<APIResponse<User>>(
            `/api/v1/admin/users/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new user
     */
    async createUser(data: Partial<User>): Promise<User> {
        const response = await apiClient.post<APIResponse<User>>(
            '/api/v1/admin/users',
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing user
     */
    async updateUser(id: number, data: Partial<User>): Promise<User> {
        const response = await apiClient.put<APIResponse<User>>(
            `/api/v1/admin/users/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a user
     */
    async deleteUser(id: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/admin/users/${id}`
        );
    },

    /**
     * Fetch all available roles
     */
    async getRoles(): Promise<role[]> {
        const response = await apiClient.get<APIResponse<role[]>>(
            '/api/v1/admin/users/roles'
        );
        return response.data.data;
    },

    /**
     * Upload user avatar
     */
    async uploadAvatar(id: number, file: File): Promise<User> {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await apiClient.post<APIResponse<User>>(
            `/api/v1/admin/users/${id}/avatar`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },
};
