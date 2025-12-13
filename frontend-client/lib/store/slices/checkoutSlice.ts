import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
    step: 'address' | 'payment' | 'confirmation';
    selectedAddressId: number | null;
    paymentProvider: 'stripe' | 'paypal';
    promoCode: string | null;
    shippingFee: number;
}

const initialState: CheckoutState = {
    step: 'address',
    selectedAddressId: null,
    paymentProvider: 'stripe',
    promoCode: null,
    shippingFee: 0
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
        resetCheckout: () => initialState
    }
});

export const {
    setCheckoutStep,
    setSelectedAddress,
    setPaymentProvider,
    setPromoCode,
    setShippingFee,
    resetCheckout
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
