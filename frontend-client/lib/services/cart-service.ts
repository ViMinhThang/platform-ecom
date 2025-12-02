import apiClient from '@/lib/api-client';
import { Cart } from '@/types/cart';
import { ApiResponse } from '@/types/user';

/**
 * Get user's cart
 */
export const getCart = async (token: string): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>('/carts/users/cart', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (
    productId: number,
    quantity: number,
    variantId: number | null,
    token: string
): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(
        '/carts/add',
        { productId, quantity, variantId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
    productId: number,
    quantityChange: number,
    variantId: number | undefined,
    token: string
): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
        `/carts/items/${productId}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
            params: { quantityChange, variantId }
        }
    );
    return response.data.data;
};

/**
 * Delete item from cart
 */
export const deleteFromCart = async (
    productId: number,
    variantId: number | undefined,
    token: string
): Promise<void> => {
    await apiClient.delete<ApiResponse<string>>(
        `/carts/items/${productId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: { variantId }
        }
    );
};
