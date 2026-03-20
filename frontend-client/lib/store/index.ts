import { configureStore } from '@reduxjs/toolkit';
import { api as baseApi } from './api/clientApi';
import checkoutReducer from './slices/checkoutSlice';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        checkout: checkoutReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['order/initiateCheckout/fulfilled'],
            },
            immutableCheck: {
                warnAfter: 128,
            },
        }).concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
