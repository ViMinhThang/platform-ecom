import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import reviewReducer from './slices/reviewSlice';
import checkoutReducer from './slices/checkoutSlice';
import promotionReducer from './slices/promotionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,
        address: addressReducer,
        orders: orderReducer,
        reviews: reviewReducer,
        checkout: checkoutReducer,
        promotion: promotionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
