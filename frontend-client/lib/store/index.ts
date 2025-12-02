import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        address: addressReducer,
        orders: orderReducer,
        reviews: reviewReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
