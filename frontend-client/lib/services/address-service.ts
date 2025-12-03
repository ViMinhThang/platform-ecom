import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/common.types';
import { Address } from '@/types/user';

/**
 * Get user's addresses
 */
export const getUserAddresses = async (token: string): Promise<Address[]> => {
    const response = await apiClient.get<APIResponse<Address[]>>('/v1/users/addresses', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

/**
 * Create new address
 */
export const createAddress = async (address: Address, token: string): Promise<Address> => {
    const response = await apiClient.post<APIResponse<Address>>(
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
    const response = await apiClient.put<APIResponse<Address>>(
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
    await apiClient.delete<APIResponse<string>>(
        `/v1/users/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

