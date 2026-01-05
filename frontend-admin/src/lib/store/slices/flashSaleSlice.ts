import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FlashSale, FlashSaleResponse, CreateFlashSaleRequest, UpdateFlashSaleRequest, AddFlashSaleItemRequest } from '@/types/flash-sale';
import { flashSaleService } from '@/lib/services/flash-sale-service';
import { logger } from '@/lib/logger';
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


export const fetchFlashSales = createAsyncThunk(
    'flashSales/fetchAll',
    async (params: { page?: number; size?: number; status?: string } = {}, { rejectWithValue }) => {
        try {
            logger.apiRequest('GET', '/api/v1/admin/flash-sales');
            const response = await flashSaleService.getAll(params);
            logger.apiResponse('GET', '/api/v1/admin/flash-sales', 200);
            return response;
        } catch (error) {
            logger.error('Failed to fetch flash sales', { error });
            return rejectWithValue('Failed to fetch flash sales');
        }
    }
);

export const fetchFlashSaleById = createAsyncThunk(
    'flashSales/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            logger.apiRequest('GET', `/api/v1/admin/flash-sales/${id}`);
            const flashSale = await flashSaleService.getById(id);
            logger.apiResponse('GET', `/api/v1/admin/flash-sales/${id}`, 200);
            return flashSale;
        } catch (error) {
            logger.error(`Failed to fetch flash sale ${id}`, { error });
            return rejectWithValue(`Failed to fetch flash sale ${id}`);
        }
    }
);

export const createFlashSale = createAsyncThunk(
    'flashSales/create',
    async (data: CreateFlashSaleRequest, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', '/api/v1/admin/flash-sales', { data });
            const flashSale = await flashSaleService.create(data);
            logger.apiResponse('POST', '/api/v1/admin/flash-sales', 201);
            return flashSale;
        } catch (error) {
            logger.error('Failed to create flash sale', { error });
            return rejectWithValue('Failed to create flash sale');
        }
    }
);

export const updateFlashSale = createAsyncThunk(
    'flashSales/update',
    async ({ id, data }: { id: number; data: UpdateFlashSaleRequest }, { rejectWithValue }) => {
        try {
            logger.apiRequest('PUT', `/api/v1/admin/flash-sales/${id}`, { data });
            const flashSale = await flashSaleService.update(id, data);
            logger.apiResponse('PUT', `/api/v1/admin/flash-sales/${id}`, 200);
            return flashSale;
        } catch (error) {
            logger.error(`Failed to update flash sale ${id}`, { error });
            return rejectWithValue(`Failed to update flash sale ${id}`);
        }
    }
);

export const deleteFlashSale = createAsyncThunk(
    'flashSales/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            logger.apiRequest('DELETE', `/api/v1/admin/flash-sales/${id}`);
            await flashSaleService.delete(id);
            logger.apiResponse('DELETE', `/api/v1/admin/flash-sales/${id}`, 200);
            return id;
        } catch (error) {
            logger.error(`Failed to delete flash sale ${id}`, { error });
            return rejectWithValue(`Failed to delete flash sale ${id}`);
        }
    }
);

export const activateFlashSale = createAsyncThunk(
    'flashSales/activate',
    async (id: number, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', `/api/v1/admin/flash-sales/${id}/activate`);
            const flashSale = await flashSaleService.activate(id);
            logger.apiResponse('POST', `/api/v1/admin/flash-sales/${id}/activate`, 200);
            return flashSale;
        } catch (error) {
            logger.error(`Failed to activate flash sale ${id}`, { error });
            return rejectWithValue(`Failed to activate flash sale ${id}`);
        }
    }
);

export const cancelFlashSale = createAsyncThunk(
    'flashSales/cancel',
    async (id: number, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', `/api/v1/admin/flash-sales/${id}/cancel`);
            const flashSale = await flashSaleService.cancel(id);
            logger.apiResponse('POST', `/api/v1/admin/flash-sales/${id}/cancel`, 200);
            return flashSale;
        } catch (error) {
            logger.error(`Failed to cancel flash sale ${id}`, { error });
            return rejectWithValue(`Failed to cancel flash sale ${id}`);
        }
    }
);

export const addFlashSaleItems = createAsyncThunk(
    'flashSales/addItems',
    async ({ id, items }: { id: number; items: AddFlashSaleItemRequest[] }, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', `/api/v1/admin/flash-sales/${id}/items`);
            const flashSale = await flashSaleService.addItems(id, items);
            logger.apiResponse('POST', `/api/v1/admin/flash-sales/${id}/items`, 200);
            return flashSale;
        } catch (error) {
            logger.error(`Failed to add items to flash sale ${id}`, { error });
            return rejectWithValue(`Failed to add items to flash sale ${id}`);
        }
    }
);

export const removeFlashSaleItem = createAsyncThunk(
    'flashSales/removeItem',
    async ({ flashSaleId, itemId }: { flashSaleId: number; itemId: number }, { rejectWithValue }) => {
        try {
            logger.apiRequest('DELETE', `/api/v1/admin/flash-sales/${flashSaleId}/items/${itemId}`);
            const flashSale = await flashSaleService.removeItem(flashSaleId, itemId);
            logger.apiResponse('DELETE', `/api/v1/admin/flash-sales/${flashSaleId}/items/${itemId}`, 200);
            return flashSale;
        } catch (error) {
            logger.error(`Failed to remove item from flash sale`, { error });
            return rejectWithValue(`Failed to remove item from flash sale`);
        }
    }
);

// ==================== Slice ====================

const flashSaleSlice = createSlice({
    name: 'flashSales',
    initialState,
    reducers: {
        clearSelectedFlashSale: (state) => {
            state.selectedFlashSale = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch All
        builder
            .addCase(fetchFlashSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlashSales.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.content;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    lastPage: action.payload.lastPage,
                };
            })
            .addCase(fetchFlashSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch By ID
        builder
            .addCase(fetchFlashSaleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlashSaleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFlashSale = action.payload;
            })
            .addCase(fetchFlashSaleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create
        builder
            .addCase(createFlashSale.pending, (state) => {
                state.mutationLoading = true;
                state.error = null;
            })
            .addCase(createFlashSale.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.items.unshift(action.payload);
                state.selectedFlashSale = action.payload;
            })
            .addCase(createFlashSale.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });

        // Update
        builder
            .addCase(updateFlashSale.pending, (state) => {
                state.mutationLoading = true;
                state.error = null;
            })
            .addCase(updateFlashSale.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.selectedFlashSale = action.payload;
                const index = state.items.findIndex((fs) => fs.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateFlashSale.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });

        // Delete
        builder
            .addCase(deleteFlashSale.pending, (state) => {
                state.mutationLoading = true;
                state.error = null;
            })
            .addCase(deleteFlashSale.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.items = state.items.filter((fs) => fs.id !== action.payload);
                if (state.selectedFlashSale?.id === action.payload) {
                    state.selectedFlashSale = null;
                }
            })
            .addCase(deleteFlashSale.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });

        // Activate
        builder
            .addCase(activateFlashSale.pending, (state) => {
                state.mutationLoading = true;
            })
            .addCase(activateFlashSale.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.selectedFlashSale = action.payload;
                const index = state.items.findIndex((fs) => fs.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(activateFlashSale.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });

        // Cancel
        builder
            .addCase(cancelFlashSale.pending, (state) => {
                state.mutationLoading = true;
            })
            .addCase(cancelFlashSale.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.selectedFlashSale = action.payload;
                const index = state.items.findIndex((fs) => fs.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(cancelFlashSale.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });

        // Add Items
        builder
            .addCase(addFlashSaleItems.pending, (state) => {
                state.mutationLoading = true;
            })
            .addCase(addFlashSaleItems.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.selectedFlashSale = action.payload;
            })
            .addCase(addFlashSaleItems.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });

        // Remove Item
        builder
            .addCase(removeFlashSaleItem.pending, (state) => {
                state.mutationLoading = true;
            })
            .addCase(removeFlashSaleItem.fulfilled, (state, action) => {
                state.mutationLoading = false;
                state.selectedFlashSale = action.payload;
            })
            .addCase(removeFlashSaleItem.rejected, (state, action) => {
                state.mutationLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedFlashSale, clearError } = flashSaleSlice.actions;
export default flashSaleSlice.reducer;
