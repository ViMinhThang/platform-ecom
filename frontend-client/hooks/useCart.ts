import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchCart,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearCart
} from '@/lib/store/slices/cartSlice';
import type { AddToCartRequest } from '@/types/cart.types';

export const useCart = () => {
    const dispatch = useAppDispatch();
    const { cart, cartBySeller, loading, error } = useAppSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const addItem = async (request: AddToCartRequest) => {
        await dispatch(addToCart(request)).unwrap();
    };

    const updateQuantity = async (productId: number, variantId: number | undefined, change: number) => {
        await dispatch(updateCartQuantity({ productId, variantId, change })).unwrap();
        // dispatch(fetchCart()); // Handled by slice logic now
    };

    const removeItem = async (productId: number, variantId?: number) => {
        await dispatch(removeCartItem({ productId, variantId })).unwrap();
        dispatch(fetchCart()); // Refresh to be safe
    };

    const clear = async () => {
        await dispatch(clearCart()).unwrap();
    };

    return {
        cart,
        cartBySeller,
        loading,
        error,
        addItem,
        updateQuantity,
        removeItem,
        clear
    };
};
