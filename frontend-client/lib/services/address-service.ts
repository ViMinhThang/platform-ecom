import apiClient from '@/lib/api-client';
import { Address, ApiResponse } from '@/types/user';

/**
 * Get user's addresses
 */
export const getUserAddresses = async (token: string): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>('/v1/users/addresses', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

/**
 * Create new address
 */
export const createAddress = async (address: Address, token: string): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>(
        '/v1/users/addresses',
        address,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Update existing address
 */
export const updateAddress = async (
    addressId: number,
    address: Address,
    token: string
): Promise<Address> => {
    const response = await apiClient.put<ApiResponse<Address>>(
        `/v1/users/addresses/${addressId}`,
        address,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Delete address
 */
export const deleteAddress = async (addressId: number, token: string): Promise<void> => {
    await apiClient.delete<ApiResponse<string>>(
        `/v1/users/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

