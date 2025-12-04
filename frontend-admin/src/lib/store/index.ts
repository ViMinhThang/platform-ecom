import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import productVariantReducer from './slices/productVariantSlice';
import productOptionReducer from './slices/productOptionSlice';
import productImageReducer from './slices/productImageSlice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';
import kanbanReducer from './slices/kanbanSlice';
import uiReducer from './slices/uiSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        productVariants: productVariantReducer,
        productOptions: productOptionReducer,
        productImages: productImageReducer,
        categories: categoryReducer,
        users: userReducer,
        kanban: kanbanReducer,
        ui: uiReducer,
        orders: orderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
