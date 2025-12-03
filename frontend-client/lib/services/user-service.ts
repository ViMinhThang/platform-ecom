import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/common.types';
import { UserProfile } from '@/types/user';

/**
 * Get user profile
 */
export const getUserProfile = async (token: string): Promise<UserProfile> => {
    const response = await apiClient.get<APIResponse<UserProfile>>(
        `/v1/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Update user profile info
 */
export const updateUserInfo = async (
    data: { username: string; email: string; password?: string; currentPassword?: string },
    token: string
): Promise<UserProfile> => {
    const response = await apiClient.put<APIResponse<UserProfile>>(
        '/v1/users/me',
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

    const response = await apiClient.put<APIResponse<string>>(
        `/v1/users/me/image`,
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
