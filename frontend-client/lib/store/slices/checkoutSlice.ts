import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CheckoutSession, OrderGroupDTO } from '@/types/order.types';

interface CheckoutState {
    step: 'address' | 'payment' | 'confirmation';
    selectedAddressId: number | null;
    paymentProvider: 'stripe' | 'paypal';
    promoCode: string | null;
    shippingFee: number;
    checkoutSession: CheckoutSession | null;
    currentOrder: OrderGroupDTO | null;
}

const initialState: CheckoutState = {
    step: 'address',
    selectedAddressId: null,
    paymentProvider: 'stripe',
    promoCode: null,
    shippingFee: 0,
    checkoutSession: null,
    currentOrder: null
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCheckoutStep: (state, action: PayloadAction<CheckoutState['step']>) => {
            state.step = action.payload;
        },
        setSelectedAddress: (state, action: PayloadAction<number>) => {
            state.selectedAddressId = action.payload;
        },
        setPaymentProvider: (state, action: PayloadAction<'stripe' | 'paypal'>) => {
            state.paymentProvider = action.payload;
        },
        setPromoCode: (state, action: PayloadAction<string | null>) => {
            state.promoCode = action.payload;
        },
        setShippingFee: (state, action: PayloadAction<number>) => {
            state.shippingFee = action.payload;
        },
        setCheckoutSession: (state, action: PayloadAction<CheckoutSession | null>) => {
            state.checkoutSession = action.payload;
        },
        setCurrentOrder: (state, action: PayloadAction<OrderGroupDTO | null>) => {
            state.currentOrder = action.payload;
        },
        resetCheckout: () => initialState
    }
});

export const {
    setCheckoutStep,
    setSelectedAddress,
    setPaymentProvider,
    setPromoCode,
    setShippingFee,
    setCheckoutSession,
    setCurrentOrder,
    resetCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
