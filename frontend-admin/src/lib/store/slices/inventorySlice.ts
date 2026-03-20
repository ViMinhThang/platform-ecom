import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryDTO } from '@/types/inventory/inventory';
import { InventoryTransactionDTO } from '@/lib/store/api/inventoryApi';

interface InventoryState {
    items: InventoryDTO[];
    lowStockItems: InventoryDTO[];
    currentInventory: InventoryDTO | null;
    transactions: InventoryTransactionDTO[];
    loading: boolean;
    adjusting: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
    };
    transactionPagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
    };
}

const initialState: InventoryState = {
    items: [],
    lowStockItems: [],
    currentInventory: null,
    transactions: [],
    loading: false,
    adjusting: false,
    error: null,
    pagination: {
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
    },
    transactionPagination: {
        pageNumber: 0,
        pageSize: 20,
        totalElements: 0,
        totalPages: 0,
    },
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<InventoryDTO[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<InventoryDTO>) => {
            state.items.unshift(action.payload);
            state.pagination.totalElements += 1;
        },
        updateItem: (state, action: PayloadAction<InventoryDTO>) => {
            const index = state.items.findIndex((i) => i.variantId === action.payload.variantId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((i) => i.variantId !== action.payload);
            state.lowStockItems = state.lowStockItems.filter((i) => i.variantId !== action.payload);
            state.pagination.totalElements = Math.max(0, state.pagination.totalElements - 1);
        },
        setLowStockItems: (state, action: PayloadAction<InventoryDTO[]>) => {
            state.lowStockItems = action.payload;
        },
        updateLowStockItem: (state, action: PayloadAction<InventoryDTO>) => {
            const index = state.lowStockItems.findIndex((i) => i.variantId === action.payload.variantId);
            if (action.payload.isLowStock) {
                if (index !== -1) {
                    state.lowStockItems[index] = action.payload;
                } else {
                    state.lowStockItems.push(action.payload);
                }
            } else if (index !== -1) {
                state.lowStockItems.splice(index, 1);
            }
        },
        setCurrentInventory: (state, action: PayloadAction<InventoryDTO | null>) => {
            state.currentInventory = action.payload;
        },
        setTransactions: (state, action: PayloadAction<InventoryTransactionDTO[]>) => {
            state.transactions = action.payload;
        },
        setPagination: (state, action: PayloadAction<Omit<InventoryState['pagination'], never>>) => {
            state.pagination = action.payload;
        },
        setTransactionPagination: (state, action: PayloadAction<Omit<InventoryState['transactionPagination'], never>>) => {
            state.transactionPagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAdjusting: (state, action: PayloadAction<boolean>) => {
            state.adjusting = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearCurrentInventory: (state) => {
            state.currentInventory = null;
            state.transactions = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.pageNumber = action.payload;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    removeItem,
    setLowStockItems,
    updateLowStockItem,
    setCurrentInventory,
    setTransactions,
    setPagination,
    setTransactionPagination,
    setLoading,
    setAdjusting,
    setError,
    clearCurrentInventory,
    clearError,
    setPage,
} = inventorySlice.actions;

export default inventorySlice.reducer;
