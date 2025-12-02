import apiClient from '@/lib/api-client';
import { UserProfile, ApiResponse } from '@/types/user';

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string, token: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
        `/auth/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Update user profile info
 */
export const updateUserInfo = async (
    data: { username: string; email: string },
    token: string
): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
        '/auth/update-info',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (
    userId: number,
    file: File,
    token: string
): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.put<ApiResponse<string>>(
        `/auth/${userId}/image`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data.data;
};

/**
 * Validate token
 */
export const validateToken = async (token: string): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
        '/auth/validate',
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};
