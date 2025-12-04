import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductOption } from '@/types/product/product-option';
import { productOptionService } from '@/lib/services/product-option-service';
import { logger } from '@/lib/logger';

/**
 * Parameters for fetching options
 */
interface FetchOptionsParams {
    productId: number;
}

/**
 * Parameters for creating an option
 */
interface CreateOptionParams {
    productId: number;
    data: ProductOption;
}

/**
 * Parameters for updating an option
 */
interface UpdateOptionParams {
    productId: number;
    optionId: number;
    data: ProductOption;
}

/**
 * Parameters for deleting an option
 */
interface DeleteOptionParams {
    productId: number;
    optionId: number;
}

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

// Async Thunks

export const fetchOptions = createAsyncThunk(
    'productOptions/fetchOptions',
    async ({ productId }: FetchOptionsParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('GET', `/api/v1/sellers/products/${productId}/options`);

            const options = await productOptionService.getOptions(productId);

            logger.apiResponse('GET', `/api/v1/sellers/products/${productId}/options`, 200);
            return options;
        } catch (error) {
            logger.error('Failed to fetch product options', { error });
            return rejectWithValue('Failed to fetch product options');
        }
    }
);

export const createOption = createAsyncThunk(
    'productOptions/createOption',
    async ({ productId, data }: CreateOptionParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', `/api/v1/sellers/products/${productId}/options`, { data });

            const option = await productOptionService.createOption(productId, data);

            logger.apiResponse('POST', `/api/v1/sellers/products/${productId}/options`, 201);
            return option;
        } catch (error) {
            logger.error('Failed to create product option', { error });
            return rejectWithValue('Failed to create product option');
        }
    }
);

export const updateOption = createAsyncThunk(
    'productOptions/updateOption',
    async ({ productId, optionId, data }: UpdateOptionParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('PUT', `/api/v1/sellers/products/${productId}/options/${optionId}`, { data });

            const option = await productOptionService.updateOption(productId, optionId, data);

            logger.apiResponse('PUT', `/api/v1/sellers/products/${productId}/options/${optionId}`, 200);
            return option;
        } catch (error) {
            logger.error('Failed to update product option', { error });
            return rejectWithValue('Failed to update product option');
        }
    }
);

export const deleteOption = createAsyncThunk(
    'productOptions/deleteOption',
    async ({ productId, optionId }: DeleteOptionParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('DELETE', `/api/v1/sellers/products/${productId}/options/${optionId}`);

            await productOptionService.deleteOption(productId, optionId);

            logger.apiResponse('DELETE', `/api/v1/sellers/products/${productId}/options/${optionId}`, 200);
            return optionId;
        } catch (error) {
            logger.error('Failed to delete product option', { error });
            return rejectWithValue('Failed to delete product option');
        }
    }
);

// Slice

const productOptionSlice = createSlice({
    name: 'productOptions',
    initialState,
    reducers: {
        setCurrentProductId: (state, action) => {
            state.currentProductId = action.payload;
        },
        clearOptions: (state) => {
            state.items = [];
            state.currentProductId = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Options
        builder
            .addCase(fetchOptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Option
        builder
            .addCase(createOption.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOption.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createOption.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Option
        builder
            .addCase(updateOption.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOption.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((o) => o.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateOption.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Option
        builder
            .addCase(deleteOption.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOption.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteOption.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setCurrentProductId,
    clearOptions,
    clearError,
} = productOptionSlice.actions;

export default productOptionSlice.reducer;
