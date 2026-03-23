import { configureStore } from '@reduxjs/toolkit';
import { api as baseApi } from './api/clientApi';
import { baseApi as adminBaseApi } from './admin/baseApi';
import checkoutReducer from './slices/checkoutSlice';

import productReducer from './admin/slices/productSlice';
import productVariantReducer from './admin/slices/productVariantSlice';
import productOptionReducer from './admin/slices/productOptionSlice';
import productImageReducer from './admin/slices/productImageSlice';
import categoryReducer from './admin/slices/categorySlice';
import userReducer from './admin/slices/userSlice';
import kanbanReducer from './admin/slices/kanbanSlice';
import uiReducer from './admin/slices/uiSlice';
import orderReducer from './admin/slices/orderSlice';
import inventoryReducer from './admin/slices/inventorySlice';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [adminBaseApi.reducerPath]: adminBaseApi.reducer,
        checkout: checkoutReducer,
        products: productReducer,
        productVariants: productVariantReducer,
        productOptions: productOptionReducer,
        productImages: productImageReducer,
        categories: categoryReducer,
        users: userReducer,
        kanban: kanbanReducer,
        ui: uiReducer,
        orders: orderReducer,
        inventory: inventoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['order/initiateCheckout/fulfilled'],
            },
            immutableCheck: {
                warnAfter: 128,
            },
        }).concat(baseApi.middleware, adminBaseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
