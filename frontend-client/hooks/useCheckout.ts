import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { initiateCheckout, confirmPayment } from '@/lib/store/slices/orderSlice';
import {
    setCheckoutStep,
    setSelectedAddress,
    setPaymentProvider,
    setShippingFee,
    resetCheckout
} from '@/lib/store/slices/checkoutSlice';
import type { CreateOrderRequest, ConfirmPaymentRequest } from '@/types/order.types';
import { v4 as uuidv4 } from 'uuid';

export const useCheckout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const { currentOrder, checkoutSession, loading, error } = useAppSelector((state) => state.orders);
    const { appliedVoucherCode } = useAppSelector((state) => state.promotion);

    const startCheckout = useCallback(async () => {
        if (!checkout.selectedAddressId) {
            throw new Error('Please select a delivery address');
        }
        if (!checkout.shippingFee || checkout.shippingFee <= 0) {
            throw new Error('Shipping fee not calculated');
        }

        const request: CreateOrderRequest = {
            addressId: checkout.selectedAddressId,
            paymentProvider: checkout.paymentProvider,
            promoCode: appliedVoucherCode || undefined,
            idempotencyKey: `checkout-${Date.now()}-${uuidv4()}`,
            shippingFee: checkout.shippingFee
        };

        const session = await dispatch(initiateCheckout(request)).unwrap();
        dispatch(setCheckoutStep('payment'));
        return session;
    }, [checkout.selectedAddressId, checkout.paymentProvider, checkout.promoCode, checkout.shippingFee, dispatch]);


    const confirmPaymentAndCreateOrder = useCallback(async (paymentIntentId: string) => {
        if (!checkout.selectedAddressId) {
            throw new Error('Address not selected');
        }
        if (!checkout.shippingFee || checkout.shippingFee <= 0) {
            throw new Error('Shipping fee not available');
        }

        const request: ConfirmPaymentRequest = {
            paymentIntentId,
            addressId: checkout.selectedAddressId,
            shippingFee: checkout.shippingFee
        };

        const order = await dispatch(confirmPayment(request)).unwrap();
        return order;
    }, [checkout.selectedAddressId, checkout.shippingFee, dispatch]);

    const completeCheckout = useCallback(() => {
        dispatch(setCheckoutStep('confirmation'));
        dispatch(resetCheckout());
    }, [dispatch]);

    const setStep = useCallback((step: any) => dispatch(setCheckoutStep(step)), [dispatch]);
    const selectAddress = useCallback((id: number) => dispatch(setSelectedAddress(id)), [dispatch]);
    const setProvider = useCallback((provider: 'stripe' | 'paypal') => dispatch(setPaymentProvider(provider)), [dispatch]);
    const setShipping = useCallback((fee: number) => dispatch(setShippingFee(fee)), [dispatch]);

    return {
        checkout,
        currentOrder,
        checkoutSession,
        loading,
        error,
        setStep,
        selectAddress,
        setProvider,
        setShipping,
        startCheckout,
        confirmPaymentAndCreateOrder,
        completeCheckout
    };
};
