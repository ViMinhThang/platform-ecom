import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useInitiateCheckoutMutation, useConfirmPaymentMutation, useGetCartQuery } from '@/lib/store/api/clientApi';
import {
    setCheckoutStep,
    setSelectedAddress,
    setPaymentProvider,
    setShippingFee,
    setCheckoutSession,
    setCurrentOrder,
    resetCheckout
} from '@/lib/store/slices/checkoutSlice';
import type { CreateOrderRequest, ConfirmPaymentRequest } from '@/types/order.types';

export const useCheckout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const { data: cart } = useGetCartQuery();
    const appliedVoucherCodes = cart?.appliedVoucherCodes || [];

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [initiateCheckoutMutation] = useInitiateCheckoutMutation();
    const [confirmPaymentMutation] = useConfirmPaymentMutation();

    const startCheckout = useCallback(async () => {
        if (!checkout.selectedAddressId) {
            throw new Error('Vui lòng chọn địa chỉ giao hàng');
        }
        if (!checkout.shippingFee || checkout.shippingFee <= 0) {
            throw new Error('Phí vận chuyển chưa được tính toán');
        }

        setLoading(true);
        setError(null);

        try {
            const request: CreateOrderRequest = {
                addressId: checkout.selectedAddressId,
                paymentProvider: checkout.paymentProvider,
                promoCode: appliedVoucherCodes[0] || undefined,
                idempotencyKey: `checkout-${Date.now()}`,
                shippingFee: checkout.shippingFee
            };

            const session = await initiateCheckoutMutation(request).unwrap();
            dispatch(setCheckoutSession(session));
            dispatch(setCheckoutStep('payment'));
            return session;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Khởi tạo thanh toán thất bại';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [checkout.selectedAddressId, checkout.paymentProvider, checkout.promoCode, checkout.shippingFee, dispatch, initiateCheckoutMutation, appliedVoucherCodes]);

    const confirmPaymentAndCreateOrder = useCallback(async (paymentIntentId: string) => {
        if (!checkout.selectedAddressId) {
            throw new Error('Chưa chọn địa chỉ giao hàng');
        }
        if (!checkout.shippingFee || checkout.shippingFee <= 0) {
            throw new Error('Phí vận chuyển không khả dụng');
        }

        setLoading(true);
        setError(null);

        try {
            const request: ConfirmPaymentRequest = {
                paymentIntentId,
                addressId: checkout.selectedAddressId,
                shippingFee: checkout.shippingFee
            };

            const order = await confirmPaymentMutation(request).unwrap();
            dispatch(setCurrentOrder(order));
            return order;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Xác nhận thanh toán thất bại';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [checkout.selectedAddressId, checkout.shippingFee, confirmPaymentMutation]);

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
