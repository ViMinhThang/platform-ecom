import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VariantFormValues } from '@/types/product/product-variant';
import { productVariantService } from '@/lib/services/product-variant-service';
import { logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parameters for fetching variants
 */
interface FetchVariantsParams {
    productId: number;
}

/**
 * Parameters for creating a variant
 */
interface CreateVariantParams {
    productId: number;
    data: VariantFormValues;
}

/**
 * Parameters for updating a variant
 */
interface UpdateVariantParams {
    productId: number;
    variantId: number;
    data: VariantFormValues;
}

/**
 * Parameters for deleting a variant
 */
interface DeleteVariantParams {
    productId: number;
    variantId: number;
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
    async ({ productId }: FetchVariantsParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('GET', `/api/v1/sellers/products/${productId}/variants`);

            const variants = await productVariantService.getProductVariants(productId);

            logger.apiResponse('GET', `/api/v1/sellers/products/${productId}/variants`, 200);
            return variants.map(v => ({ ...v, variantId: v.id }));
        } catch (error) {
            logger.error('Failed to fetch variants', { error });
            return rejectWithValue('Failed to fetch variants');
        }
    }
);

export const createVariant = createAsyncThunk(
    'productVariants/createVariant',
    async ({ productId, data }: CreateVariantParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('POST', `/api/v1/sellers/products/${productId}/variants`, { data });

            const variant = await productVariantService.createVariant(productId, data);

            logger.apiResponse('POST', `/api/v1/sellers/products/${productId}/variants`, 201);
            return { ...variant, variantId: variant.id };
        } catch (error) {
            logger.error('Failed to create variant', { error });
            return rejectWithValue('Failed to create variant');
        }
    }
);

export const updateVariant = createAsyncThunk(
    'productVariants/updateVariant',
    async ({ productId, variantId, data }: UpdateVariantParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('PUT', `/api/v1/sellers/products/${productId}/variants/${variantId}`, { data });

            const variant = await productVariantService.updateVariant(productId, variantId, data);

            logger.apiResponse('PUT', `/api/v1/sellers/products/${productId}/variants/${variantId}`, 200);
            return { ...variant, variantId: variant.id };
        } catch (error) {
            logger.error('Failed to update variant', { error });
            return rejectWithValue('Failed to update variant');
        }
    }
);

export const deleteVariant = createAsyncThunk(
    'productVariants/deleteVariant',
    async ({ productId, variantId }: DeleteVariantParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('DELETE', `/api/v1/sellers/products/${productId}/variants/${variantId}`);

            await productVariantService.deleteVariant(productId, variantId);

            logger.apiResponse('DELETE', `/api/v1/sellers/products/${productId}/variants/${variantId}`, 200);
            return variantId;
        } catch (error) {
            logger.error('Failed to delete variant', { error });
            return rejectWithValue('Failed to delete variant');
        }
    }
);

export const toggleVariantVisibility = createAsyncThunk(
    'productVariants/toggleVisibility',
    async ({ productId, variantId }: DeleteVariantParams, { rejectWithValue }) => {
        try {
            logger.apiRequest('PATCH', `/api/v1/sellers/products/${productId}/variants/${variantId}/visibility`);

            const variant = await productVariantService.toggleVisibility(productId, variantId);

            logger.apiResponse('PATCH', `/api/v1/sellers/products/${productId}/variants/${variantId}/visibility`, 200);
            return { ...variant, variantId: variant.id };
        } catch (error) {
            logger.error('Failed to toggle variant visibility', { error });
            return rejectWithValue('Failed to toggle variant visibility');
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

        // Toggle Visibility - uses local loading state only to avoid clearing the list
        builder
            .addCase(toggleVariantVisibility.pending, (state) => {
                state.error = null;
            })
            .addCase(toggleVariantVisibility.fulfilled, (state, action) => {
                const index = state.items.findIndex((v) => v.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(toggleVariantVisibility.rejected, (state, action) => {
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
