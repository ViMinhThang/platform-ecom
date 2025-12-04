import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { initiateCheckout, confirmPayment } from '@/lib/store/slices/orderSlice';
import {
    setCheckoutStep,
    setSelectedAddress,
    setPaymentProvider,
    resetCheckout
} from '@/lib/store/slices/checkoutSlice';
import type { CreateOrderRequest, ConfirmPaymentRequest } from '@/types/order.types';
import { v4 as uuidv4 } from 'uuid';

export const useCheckout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const { currentOrder, checkoutSession, loading, error } = useAppSelector((state) => state.orders);

    /**
     * Step 1: Initiate checkout - creates Stripe PaymentIntent
     * No order is created at this step
     */
    const startCheckout = useCallback(async () => {
        if (!checkout.selectedAddressId) {
            throw new Error('Please select a delivery address');
        }

        const request: CreateOrderRequest = {
            addressId: checkout.selectedAddressId,
            paymentProvider: checkout.paymentProvider,
            promoCode: checkout.promoCode || undefined,
            idempotencyKey: `checkout-${Date.now()}-${uuidv4()}`
        };

        const session = await dispatch(initiateCheckout(request)).unwrap();
        dispatch(setCheckoutStep('payment'));
        return session;
    }, [checkout.selectedAddressId, checkout.paymentProvider, checkout.promoCode, dispatch]);

    /**
     * Step 2: Confirm payment and create order
     * Called after Stripe payment succeeds
     */
    const confirmPaymentAndCreateOrder = useCallback(async (paymentIntentId: string) => {
        if (!checkout.selectedAddressId) {
            throw new Error('Address not selected');
        }

        const request: ConfirmPaymentRequest = {
            paymentIntentId,
            addressId: checkout.selectedAddressId
        };

        const order = await dispatch(confirmPayment(request)).unwrap();
        return order;
    }, [checkout.selectedAddressId, dispatch]);

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
        checkoutSession,
        loading,
        error,
        setStep,
        selectAddress,
        setProvider,
        startCheckout,
        confirmPaymentAndCreateOrder,
        completeCheckout
    };
};
