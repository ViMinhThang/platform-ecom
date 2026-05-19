import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductOption } from '@/types/product/product-option';

interface ProductOptionState {
    items: ProductOption[];
    loading: boolean;
    error: string | null;
    currentProductId: number | null;
}

const initialState: ProductOptionState = {
    items: [],
    loading: false,
    error: null,
    currentProductId: null,
};

const productOptionSlice = createSlice({
    name: 'productOptions',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<ProductOption[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<ProductOption>) => {
            state.items.push(action.payload);
        },
        updateItem: (state, action: PayloadAction<ProductOption>) => {
            const index = state.items.findIndex((o) => o.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        setCurrentProductId: (state, action: PayloadAction<number | null>) => {
            state.currentProductId = action.payload;
        },
        clearOptions: (state) => {
            state.items = [];
            state.currentProductId = null;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    removeItem,
    setCurrentProductId,
    clearOptions,
    setLoading,
    setError,
    clearError,
} = productOptionSlice.actions;

export default productOptionSlice.reducer;
