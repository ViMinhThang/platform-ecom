import { useEffect } from 'react';
import {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useRemoveCartItemMutation,
    useClearCartMutation
} from '@/lib/store/api/clientApi';
import type { AddToCartRequest, CartDTO, CartBySeller } from '@/types/cart.types';

function groupItemsBySeller(cart: CartDTO): CartBySeller[] {
    if (!cart || !cart.items) return [];

    const grouped = cart.items.reduce((acc, item) => {
        if (!acc[item.sellerId]) {
            acc[item.sellerId] = {
                sellerId: item.sellerId,
                sellerName: item.sellerName,
                items: [],
                subtotal: 0
            };
        }
        acc[item.sellerId].items.push(item);
        acc[item.sellerId].subtotal += item.totalPrice;
        return acc;
    }, {} as Record<number, CartBySeller>);

    return Object.values(grouped);
}

export interface UseCartReturn {
    cart: CartDTO | null;
    cartBySeller: CartBySeller[];
    loading: boolean;
    error: unknown;
    addItem: (request: AddToCartRequest) => Promise<void>;
    updateQuantity: (productId: number, variantId: number | undefined, change: number) => Promise<void>;
    removeItem: (productId: number, variantId?: number) => Promise<void>;
    clear: () => Promise<void>;
    refetch: () => void;
}

export const useCart = (): UseCartReturn => {
    const { data, isLoading, error, refetch } = useGetCartQuery();
    const [addToCartMutation] = useAddToCartMutation();
    const [updateQuantityMutation] = useUpdateCartQuantityMutation();
    const [removeItemMutation] = useRemoveCartItemMutation();
    const [clearCartMutation] = useClearCartMutation();

    const cart = data || null;
    const cartBySeller = cart ? groupItemsBySeller(cart) : [];

    const addItem = async (request: AddToCartRequest) => {
        await addToCartMutation(request).unwrap();
    };

    const updateQuantity = async (productId: number, variantId: number | undefined, change: number) => {
        await updateQuantityMutation({ productId, variantId, change }).unwrap();
    };

    const removeItem = async (productId: number, variantId?: number) => {
        await removeItemMutation({ productId, variantId }).unwrap();
        refetch();
    };

    const clear = async () => {
        await clearCartMutation().unwrap();
    };

    return {
        cart,
        cartBySeller,
        loading: isLoading,
        error,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        refetch,
    };
};
