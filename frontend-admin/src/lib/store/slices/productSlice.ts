import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductRow } from '@/types/product/product';
import { PAGINATION } from '@/config/constants';

interface ProductState {
    items: ProductRow[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        lastPage: boolean;
    };
}

const initialState: ProductState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
    pagination: {
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_SIZE,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<ProductRow[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<ProductRow>) => {
            state.items.unshift(action.payload);
        },
        updateItem: (state, action: PayloadAction<ProductRow>) => {
            const index = state.items.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
        setPagination: (state, action: PayloadAction<Omit<ProductState['pagination'], never>>) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
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
    setSelectedProduct,
    setPagination,
    setLoading,
    setError,
    clearSelectedProduct,
    clearError,
} = productSlice.actions;

export default productSlice.reducer;
