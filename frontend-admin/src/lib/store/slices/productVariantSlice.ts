import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { VariantFormValues } from '@/types/product/product-variant';
import { API_ENDPOINTS } from '@/config/constants';
import { createRequestConfig, handleApiError, unwrapResponse } from '@/lib/utils/api';
import { logger } from '@/lib/logger';
import { APIResponse } from '@/types/api-response';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parameters for fetching variants
 */
interface FetchVariantsParams {
    productId: number;
    token: string;
}

/**
 * Parameters for creating a variant
 */
interface CreateVariantParams {
    productId: number;
    data: VariantFormValues;
    token: string;
}

/**
 * Parameters for updating a variant
 */
interface UpdateVariantParams {
    productId: number;
    variantId: number;
    data: VariantFormValues;
    token: string;
}

/**
 * Parameters for deleting a variant
 */
interface DeleteVariantParams {
    productId: number;
    variantId: number;
    token: string;
}

interface ProductVariantState {
    items: VariantFormValues[];
    loading: boolean;
    error: string | null;
    currentProductId: number | null;
}

const initialState: ProductVariantState = {
    items: [],
    loading: false,
    error: null,
    currentProductId: null,
};

// Async Thunks

export const fetchVariants = createAsyncThunk(
    'productVariants/fetchVariants',
    async ({ productId, token }: FetchVariantsParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/${productId}/variants`;
            logger.apiRequest('GET', url);

            const response = await axios.get<APIResponse<VariantFormValues[]>>(url, createRequestConfig(token));

            logger.apiResponse('GET', url, response.status);
            const variants = unwrapResponse(response);

            return variants.map(v => ({ ...v, variantId: v.id }));
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to fetch variants');
        }
    }
);

export const createVariant = createAsyncThunk(
    'productVariants/createVariant',
    async ({ productId, data, token }: CreateVariantParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/${productId}/variants`;
            logger.apiRequest('POST', url, { data });

            const response = await axios.post<APIResponse<VariantFormValues>>(
                url,
                data,
                createRequestConfig(token)
            );

            logger.apiResponse('POST', url, response.status);
            const variant = unwrapResponse(response);
            return { ...variant, variantId: variant.id };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to create variant');
        }
    }
);

export const updateVariant = createAsyncThunk(
    'productVariants/updateVariant',
    async ({ productId, variantId, data, token }: UpdateVariantParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/${productId}/variants/${variantId}`;
            logger.apiRequest('PUT', url, { data });

            const response = await axios.put<APIResponse<VariantFormValues>>(url, data, createRequestConfig(token));

            logger.apiResponse('PUT', url, response.status);
            const variant = unwrapResponse(response);
            return { ...variant, variantId: variant.id };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to update variant');
        }
    }
);

export const deleteVariant = createAsyncThunk(
    'productVariants/deleteVariant',
    async ({ productId, variantId, token }: DeleteVariantParams, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.PRODUCTS}/${productId}/variants/${variantId}`;
            logger.apiRequest('DELETE', url);

            const response = await axios.delete<APIResponse<string>>(url, createRequestConfig(token));

            logger.apiResponse('DELETE', url, response.status);
            unwrapResponse(response);
            return variantId;
        } catch (error) {
            handleApiError(error);
            return rejectWithValue('Failed to delete variant');
        }
    }
);

// Slice

const productVariantSlice = createSlice({
    name: 'productVariants',
    initialState,
    reducers: {
        addNewVariant: (state) => {
            const newVariant: VariantFormValues = {
                tempId: uuidv4(),
                sku: '',
                price: 0,
                stock: 0,
                isActive: true,
                optionValues: [],
                imageUrl: '',
            };
            state.items.push(newVariant);
        },
        removeVariantLocally: (state, action) => {
            const variantKey = action.payload;
            state.items = state.items.filter(
                (v) => v.id !== variantKey && v.tempId !== variantKey
            );
        },
        updateVariantField: (state, action) => {
            const { variantKey, field, value } = action.payload;
            const variant = state.items.find(
                (v) => v.id === variantKey || v.tempId === variantKey
            );
            if (variant) {
                (variant as any)[field] = value;
            }
        },
        setCurrentProductId: (state, action) => {
            state.currentProductId = action.payload;
        },
        clearVariants: (state) => {
            state.items = [];
            state.currentProductId = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Variants
        builder
            .addCase(fetchVariants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVariants.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchVariants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Variant
        builder
            .addCase(createVariant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVariant.fulfilled, (state, action) => {
                state.loading = false;
                // Replace temp variant with real one
                const tempId = state.items.find(v => !v.id)?.tempId;
                if (tempId) {
                    state.items = state.items.map(v =>
                        v.tempId === tempId ? action.payload : v
                    );
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(createVariant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update Variant
        builder
            .addCase(updateVariant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVariant.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((v) => v.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateVariant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Variant
        builder
            .addCase(deleteVariant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVariant.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(deleteVariant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    addNewVariant,
    removeVariantLocally,
    updateVariantField,
    setCurrentProductId,
    clearVariants,
    clearError,
} = productVariantSlice.actions;

export default productVariantSlice.reducer;
