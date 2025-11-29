import { UserProfile, Address, ApiResponse, PaginatedResponse, Order } from '@/types/user';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function getAuthHeader() {
    const session = await getSession();
    // @ts-ignore
    const token = session?.accessToken;
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/auth/${userId}`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    const data: UserProfile = await response.json();
    return data;
}

export async function updateUserInfo(data: { username: string; email: string }): Promise<UserProfile> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/auth/update-info`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update user info');
    }

    const dataResponse: UserProfile = await response.json();
    return dataResponse;
}

export async function uploadProfileImage(userId: number, file: File): Promise<string> {
    const session = await getSession();
    // @ts-ignore
    const token = session?.accessToken;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/auth/${userId}/image`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const imageUrl = await response.text();
    return imageUrl;
}

export async function getUserAddresses(): Promise<Address[]> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/addresses/user`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch addresses');
    }

    const data: Address[] = await response.json();
    return data;
}

export async function createAddress(address: Address): Promise<Address> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(address),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create address');
    }

    const data: Address = await response.json();
    return data;
}

export async function updateAddress(addressId: number, address: Address): Promise<Address> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(address),
    });

    if (!response.ok) {
        throw new Error('Failed to update address');
    }

    const data: Address = await response.json();
    return data;
}

export async function deleteAddress(addressId: number): Promise<void> {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to delete address');
    }
}

export async function getUserOrders(
    pageNumber: number = 0,
    pageSize: number = 10,
    sortBy: string = 'orderDate',
    sortOrder: string = 'desc'
): Promise<PaginatedResponse<Order>> {
    const headers = await getAuthHeader();
    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
    });

    const response = await fetch(`${API_BASE_URL}/orders/user/history?${queryParams}`, {
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order history');
    }

    const data: PaginatedResponse<Order> = await response.json();
    return data;
}
