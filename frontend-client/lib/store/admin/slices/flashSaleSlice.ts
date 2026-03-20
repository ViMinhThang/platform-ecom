import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlashSale } from '@/types/admin/flash-sale';
import { PAGINATION } from '@/config/constants';

interface FlashSaleState {
    items: FlashSale[];
    selectedFlashSale: FlashSale | null;
    loading: boolean;
    mutationLoading: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        lastPage: boolean;
    };
}

const initialState: FlashSaleState = {
    items: [],
    selectedFlashSale: null,
    loading: false,
    mutationLoading: false,
    error: null,
    pagination: {
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_SIZE,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
};

const flashSaleSlice = createSlice({
    name: 'flashSales',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<FlashSale[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<FlashSale>) => {
            state.items.unshift(action.payload);
        },
        updateItem: (state, action: PayloadAction<FlashSale>) => {
            const index = state.items.findIndex((fs) => fs.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((fs) => fs.id !== action.payload);
            if (state.selectedFlashSale?.id === action.payload) {
                state.selectedFlashSale = null;
            }
        },
        setSelectedFlashSale: (state, action: PayloadAction<FlashSale | null>) => {
            state.selectedFlashSale = action.payload;
        },
        setPagination: (state, action: PayloadAction<Omit<FlashSaleState['pagination'], never>>) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setMutationLoading: (state, action: PayloadAction<boolean>) => {
            state.mutationLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearSelectedFlashSale: (state) => {
            state.selectedFlashSale = null;
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
    setSelectedFlashSale,
    setPagination,
    setLoading,
    setMutationLoading,
    setError,
    clearSelectedFlashSale,
    clearError,
} = flashSaleSlice.actions;

export default flashSaleSlice.reducer;
