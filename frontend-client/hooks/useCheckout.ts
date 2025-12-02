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

    const proceedToPayment = async () => {
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
    };

    const completeCheckout = () => {
        dispatch(setCheckoutStep('confirmation'));
        dispatch(resetCheckout());
    };

    return {
        checkout,
        currentOrder,
        loading,
        error,
        setStep: (step: any) => dispatch(setCheckoutStep(step)),
        selectAddress: (id: number) => dispatch(setSelectedAddress(id)),
        setProvider: (provider: 'stripe' | 'paypal') => dispatch(setPaymentProvider(provider)),
        proceedToPayment,
        completeCheckout
    };
};
