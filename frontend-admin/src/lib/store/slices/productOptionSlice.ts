import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductOption } from '@/types/product/product-option';
import { API_ENDPOINTS } from '@/config/constants';
import { createRequestConfig, handleApiError, unwrapResponse } from '@/lib/utils/api';
import { logger } from '@/lib/logger';
import { APIResponse } from '@/types/api-response';

/**
 * Parameters for fetching options
 */
interface FetchOptionsParams {
    productId: number;
    token: string;
}

/**
 * Parameters for creating an option
 */
interface CreateOptionParams {
    productId: number;
    data: ProductOption;
    token: string;
}

/**
 * Parameters for updating an option
 */
interface UpdateOptionParams {
    productId: number;
    optionId: number;
    data: ProductOption;
    token: string;
}

/**
 * Parameters for deleting an option
 */
interface DeleteOptionParams {
    productId: number;
    optionId: number;
    token: string;
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
    async ({ productId, token }: FetchOptionsParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/${productId}/options`;
            logger.apiRequest('GET', url);

            const response = await axios.get<APIResponse<ProductOption[]>>(url, createRequestConfig(token));

            logger.apiResponse('GET', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to fetch product options');
        }
    }
);

export const createOption = createAsyncThunk(
    'productOptions/createOption',
    async ({ productId, data, token }: CreateOptionParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/product-options/${productId}`;
            logger.apiRequest('POST', url, { data });

            // Ensure isRequired is boolean
            const payload = {
                ...data,
                isRequired: Boolean(data.isRequired)
            };

            const response = await axios.post<APIResponse<ProductOption>>(
                url,
                payload,
                createRequestConfig(token)
            );

            logger.apiResponse('POST', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to create product option');
        }
    }
);

export const updateOption = createAsyncThunk(
    'productOptions/updateOption',
    async ({ productId, optionId, data, token }: UpdateOptionParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/product-options/${productId}/${optionId}`;
            logger.apiRequest('PUT', url, { data });

            // Ensure isRequired is boolean
            const payload = {
                ...data,
                isRequired: Boolean(data.isRequired)
            };

            const response = await axios.put<APIResponse<ProductOption>>(url, payload, createRequestConfig(token));

            logger.apiResponse('PUT', url, response.status);
            return unwrapResponse(response);
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to update product option');
        }
    }
);

export const deleteOption = createAsyncThunk(
    'productOptions/deleteOption',
    async ({ productId, optionId, token }: DeleteOptionParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/product-options/${productId}/${optionId}`;
            logger.apiRequest('DELETE', url);

            const response = await axios.delete<APIResponse<string>>(url, createRequestConfig(token));

            logger.apiResponse('DELETE', url, response.status);
            unwrapResponse(response);
            return optionId;
        } catch (error) {
            handleApiError(error);
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
