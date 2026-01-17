import apiClient from '@/lib/api-client';
import { CartDTO, AddToCartRequest } from '@/types/cart.types';
import { APIResponse } from '@/types/common.types';

const CART_API = '/v1/cart';

export const cartService = {
    // Get current user's cart
    getCart: async (): Promise<CartDTO> => {
        const { data } = await apiClient.get<APIResponse<CartDTO>>(CART_API);
        return data.data;
    },

    // Add item to cart
    addToCart: async (request: AddToCartRequest): Promise<CartDTO> => {
        const { data } = await apiClient.post<APIResponse<CartDTO>>(
            `${CART_API}/add`,
            request
        );
        return data.data;
    },

    // Update item quantity
    updateQuantity: async (
        productId: number,
        variantId: number | undefined,
        quantityChange: number
    ): Promise<CartDTO> => {
        const params = new URLSearchParams();
        params.append('quantityChange', quantityChange.toString());
        if (variantId) params.append('variantId', variantId.toString());

        const { data } = await apiClient.put<APIResponse<CartDTO>>(
            `${CART_API}/items/${productId}?${params.toString()}`
        );
        return data.data;
    },

    // Remove item from cart
    removeItem: async (productId: number, variantId?: number): Promise<void> => {
        const params = variantId ? `?variantId=${variantId}` : '';
        await apiClient.delete(`${CART_API}/items/${productId}${params}`);
    },

    // Clear entire cart
    clearCart: async (): Promise<void> => {
        await apiClient.delete(`${CART_API}/clear`);
    }
};

