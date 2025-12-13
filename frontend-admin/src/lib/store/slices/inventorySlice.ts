import inventoryService, { InventoryTransactionDTO } from '@/lib/services/inventory-service';
import { InventoryDTO, InventorySettingsRequest, StockAdjustmentRequest } from '@/types/inventory/inventory';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


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

// ==================== Async Thunks ====================

export const fetchInventory = createAsyncThunk(
    'inventory/fetchInventory',
    async (
        params: { page?: number; size?: number; sortBy?: string; sortOrder?: string },
        { rejectWithValue }
    ) => {
        try {
            return await inventoryService.getAll(
                params.page ?? 0,
                params.size ?? 20,
                params.sortBy ?? 'variantId',
                params.sortOrder ?? 'asc'
            );
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);

export const fetchInventoryByVariantId = createAsyncThunk(
    'inventory/fetchByVariantId',
    async (variantId: number, { rejectWithValue }) => {
        try {
            return await inventoryService.getByVariantId(variantId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
        }
    }
);

export const fetchLowStockItems = createAsyncThunk(
    'inventory/fetchLowStock',
    async (_, { rejectWithValue }) => {
        try {
            return await inventoryService.getLowStock();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock items');
        }
    }
);

export const fetchTransactionHistory = createAsyncThunk(
    'inventory/fetchTransactions',
    async (
        { variantId, page, size }: { variantId: number; page?: number; size?: number },
        { rejectWithValue }
    ) => {
        try {
            return await inventoryService.getTransactions(variantId, page ?? 0, size ?? 20);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

export const adjustStock = createAsyncThunk(
    'inventory/adjustStock',
    async (
        { variantId, request }: { variantId: number; request: StockAdjustmentRequest },
        { rejectWithValue }
    ) => {
        try {
            return await inventoryService.adjustStock(variantId, request);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to adjust stock');
        }
    }
);

export const updateInventorySettings = createAsyncThunk(
    'inventory/updateSettings',
    async (
        { variantId, request }: { variantId: number; request: InventorySettingsRequest },
        { rejectWithValue }
    ) => {
        try {
            return await inventoryService.updateSettings(variantId, request);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
        }
    }
);

export const createInventory = createAsyncThunk(
    'inventory/create',
    async (
        { productId, variantId, sku, initialStock }:
            { productId: number; variantId: number; sku?: string; initialStock?: number },
        { rejectWithValue }
    ) => {
        try {
            return await inventoryService.create(productId, variantId, sku, initialStock);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create inventory');
        }
    }
);

export const deleteInventory = createAsyncThunk(
    'inventory/delete',
    async (variantId: number, { rejectWithValue }) => {
        try {
            await inventoryService.delete(variantId);
            return variantId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete inventory');
        }
    }
);

// ==================== Slice ====================

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
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
    extraReducers: (builder) => {
        // Fetch Inventory
        builder.addCase(fetchInventory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchInventory.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.content;
            state.pagination = {
                pageNumber: action.payload.pageNumber,
                pageSize: action.payload.pageSize,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
            };
        });
        builder.addCase(fetchInventory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch by Variant ID
        builder.addCase(fetchInventoryByVariantId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchInventoryByVariantId.fulfilled, (state, action) => {
            state.loading = false;
            state.currentInventory = action.payload;
        });
        builder.addCase(fetchInventoryByVariantId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Low Stock
        builder.addCase(fetchLowStockItems.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchLowStockItems.fulfilled, (state, action) => {
            state.loading = false;
            state.lowStockItems = action.payload;
        });
        builder.addCase(fetchLowStockItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Transactions
        builder.addCase(fetchTransactionHistory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchTransactionHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload.content;
            state.transactionPagination = {
                pageNumber: action.payload.pageNumber,
                pageSize: action.payload.pageSize,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
            };
        });
        builder.addCase(fetchTransactionHistory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Adjust Stock
        builder.addCase(adjustStock.pending, (state) => {
            state.adjusting = true;
            state.error = null;
        });
        builder.addCase(adjustStock.fulfilled, (state, action) => {
            state.adjusting = false;
            state.currentInventory = action.payload;
            // Update in list if exists
            const index = state.items.findIndex((i) => i.variantId === action.payload.variantId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            // Update in low stock if exists
            const lowIndex = state.lowStockItems.findIndex((i) => i.variantId === action.payload.variantId);
            if (lowIndex !== -1) {
                if (action.payload.isLowStock) {
                    state.lowStockItems[lowIndex] = action.payload;
                } else {
                    state.lowStockItems.splice(lowIndex, 1);
                }
            } else if (action.payload.isLowStock) {
                state.lowStockItems.push(action.payload);
            }
        });
        builder.addCase(adjustStock.rejected, (state, action) => {
            state.adjusting = false;
            state.error = action.payload as string;
        });

        // Update Settings
        builder.addCase(updateInventorySettings.fulfilled, (state, action) => {
            state.currentInventory = action.payload;
            const index = state.items.findIndex((i) => i.variantId === action.payload.variantId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });

        // Create Inventory
        builder.addCase(createInventory.fulfilled, (state, action) => {
            state.items.unshift(action.payload);
            state.pagination.totalElements += 1;
        });

        // Delete Inventory
        builder.addCase(deleteInventory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteInventory.fulfilled, (state, action) => {
            state.loading = false;
            const variantId = action.payload;
            state.items = state.items.filter((i) => i.variantId !== variantId);
            state.lowStockItems = state.lowStockItems.filter((i) => i.variantId !== variantId);
            state.pagination.totalElements = Math.max(0, state.pagination.totalElements - 1);
        });
        builder.addCase(deleteInventory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCurrentInventory, clearError, setPage } = inventorySlice.actions;
export default inventorySlice.reducer;
