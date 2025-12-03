import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { createOrder } from '@/lib/store/slices/orderSlice';
import {
    setCheckoutStep,
    setSelectedAddress,
    setPaymentProvider,
    resetCheckout
} from '@/lib/store/slices/checkoutSlice';
import type { CreateOrderRequest } from '@/types/order.types';
import { v4 as uuidv4 } from 'uuid';

export const useCheckout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const { currentOrder, loading, error } = useAppSelector((state) => state.orders); // Note: state.orders matches store config

    const proceedToPayment = useCallback(async () => {
        if (!checkout.selectedAddressId) {
            throw new Error('Please select a delivery address');
        }

        const request: CreateOrderRequest = {
            addressId: checkout.selectedAddressId,
            paymentProvider: checkout.paymentProvider,
            promoCode: checkout.promoCode || undefined,
            idempotencyKey: `checkout-${Date.now()}-${uuidv4()}`
        };

        const order = await dispatch(createOrder(request)).unwrap();
        dispatch(setCheckoutStep('payment'));
        return order;
    }, [checkout.selectedAddressId, checkout.paymentProvider, checkout.promoCode, dispatch]);

    const completeCheckout = useCallback(() => {
        dispatch(setCheckoutStep('confirmation'));
        dispatch(resetCheckout());
    }, [dispatch]);

    const setStep = useCallback((step: any) => dispatch(setCheckoutStep(step)), [dispatch]);
    const selectAddress = useCallback((id: number) => dispatch(setSelectedAddress(id)), [dispatch]);
    const setProvider = useCallback((provider: 'stripe' | 'paypal') => dispatch(setPaymentProvider(provider)), [dispatch]);

    return {
        checkout,
        currentOrder,
        loading,
        error,
        setStep,
        selectAddress,
        setProvider,
        proceedToPayment,
        completeCheckout
    };
};
