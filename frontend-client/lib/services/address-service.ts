import apiClient from '@/lib/api-client';
import { Address, ApiResponse } from '@/types/user';

/**
 * Get user's addresses
 */
export const getUserAddresses = async (token: string): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>('/addresses/user', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

/**
 * Create new address
 */
export const createAddress = async (address: Address, token: string): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>(
        '/addresses',
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
        `/addresses/${addressId}`,
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
        `/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
