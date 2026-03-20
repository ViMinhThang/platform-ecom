import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/types/category/category';
import { PAGINATION } from '@/config/constants';

interface CategoryState {
    items: Category[];
    selectedCategory: Category | null;
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

const initialState: CategoryState = {
    items: [],
    selectedCategory: null,
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

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Category[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<Category>) => {
            state.items.unshift(action.payload);
        },
        updateItem: (state, action: PayloadAction<Category>) => {
            const index = state.items.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
            state.selectedCategory = action.payload;
        },
        setPagination: (state, action: PayloadAction<Omit<CategoryState['pagination'], never>>) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
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
    setSelectedCategory,
    setPagination,
    setLoading,
    setError,
    clearSelectedCategory,
    clearError,
} = categorySlice.actions;

export default categorySlice.reducer;
