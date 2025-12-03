import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/common.types';
import { UserProfile } from '@/types/user';

/**
 * Register new user
 */
export interface RegisterUserData {
    username: string;
    email: string;
    password: string;
    role?: string[];
}

export const registerUser = async (data: RegisterUserData): Promise<{ message: string }> => {
    const response = await apiClient.post<APIResponse<{ message: string }>>(
        '/auth/signup',
        {
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role || ['user'],
        }
    );
    return response.data.data;
};

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<APIResponse<UserProfile>>(`/v1/users/me`);
    return response.data.data;
};

/**
 * Update user profile info
 */
export const updateUserInfo = async (
    data: { username: string; email: string; password?: string; currentPassword?: string }
): Promise<UserProfile> => {
    const response = await apiClient.put<APIResponse<UserProfile>>(
        '/v1/users/me',
        data
    );
    return response.data.data;
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (
    file: File
): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.put<APIResponse<string>>(
        `/v1/users/me/image`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data.data;
};

