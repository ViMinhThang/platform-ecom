import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';
import { ProductImage } from '@/types/product/product';
import { logger } from '@/lib/logger';
import { unwrapResponse, handleApiError } from '@/lib/utils/api';

/**
 * State shape for product images
 */
interface ProductImageState {
    imagesByProductId: Record<number, ProductImage[]>;
    loading: boolean;
    error: string | null;
    uploadProgress: number;
}

const initialState: ProductImageState = {
    imagesByProductId: {},
    loading: false,
    error: null,
    uploadProgress: 0,
};

/**
 * Fetch all images for a product
 */
export const fetchProductImages = createAsyncThunk(
    'productImages/fetchProductImages',
    async (productId: number, { rejectWithValue }) => {
        try {
            const url = `/api/v1/sellers/products/${productId}/images`;
            logger.apiRequest('GET', url);

            const response = await apiClient.get<APIResponse<ProductImage[]>>(url);

            logger.apiResponse('GET', url, response.status);
            return { productId, images: unwrapResponse(response) };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to fetch images for product ${productId}`);
        }
    }
);

/**
 * Upload a new image for a product
 */
export const uploadProductImage = createAsyncThunk(
    'productImages/uploadProductImage',
    async (
        { productId, file }: { productId: number; file: File },
        { rejectWithValue }
    ) => {
        try {
            const url = `/api/v1/sellers/products/${productId}/images`;
            logger.apiRequest('POST', url, { fileName: file.name });

            const formData = new FormData();
            formData.append('image', file);

            const response = await apiClient.post<APIResponse<ProductImage>>(
                url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            logger.apiResponse('POST', url, response.status);
            return { productId, image: unwrapResponse(response) };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(`Failed to upload image for product ${productId}`);
        }
    }
);

/**
 * Update an existing product image
 */
export const updateProductImage = createAsyncThunk(
    'productImages/updateProductImage',
    async (
        {
            productId,
            imageId,
            file,
        }: { productId: number; imageId: number; file: File },
        { rejectWithValue }
    ) => {
        try {
            const url = `/api/v1/sellers/products/${productId}/images/${imageId}`;
            logger.apiRequest('PUT', url, { fileName: file.name });

            const formData = new FormData();
            formData.append('image', file);

            const response = await apiClient.put<APIResponse<ProductImage>>(
                url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            logger.apiResponse('PUT', url, response.status);
            return { productId, image: unwrapResponse(response) };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(
                `Failed to update image ${imageId} for product ${productId}`
            );
        }
    }
);

/**
 * Delete a product image
 */
export const deleteProductImage = createAsyncThunk(
    'productImages/deleteProductImage',
    async (
        { productId, imageId }: { productId: number; imageId: number },
        { rejectWithValue }
    ) => {
        try {
            const url = `/api/v1/sellers/products/${productId}/images/${imageId}`;
            logger.apiRequest('DELETE', url);

            const response = await apiClient.delete<APIResponse<string>>(url);

            logger.apiResponse('DELETE', url, response.status);
            unwrapResponse(response); // Verify success
            return { productId, imageId };
        } catch (error) {
            handleApiError(error);
            return rejectWithValue(
                `Failed to delete image ${imageId} for product ${productId}`
            );
        }
    }
);

/**
 * Product Image Slice
 */
const productImageSlice = createSlice({
    name: 'productImages',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearImagesForProduct: (state, action: PayloadAction<number>) => {
            delete state.imagesByProductId[action.payload];
        },
        resetUploadProgress: (state) => {
            state.uploadProgress = 0;
        },
    },
    extraReducers: (builder) => {
        // Fetch Product Images
        builder
            .addCase(fetchProductImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductImages.fulfilled, (state, action) => {
                state.loading = false;
                state.imagesByProductId[action.payload.productId] =
                    action.payload.images;
            })
            .addCase(fetchProductImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Upload Product Image
        builder
            .addCase(uploadProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.uploadProgress = 0;
            })
            .addCase(uploadProductImage.fulfilled, (state, action) => {
                state.loading = false;
                state.uploadProgress = 100;
                const { productId, image } = action.payload;
                if (!state.imagesByProductId[productId]) {
                    state.imagesByProductId[productId] = [];
                }
                state.imagesByProductId[productId].push(image);
            })
            .addCase(uploadProductImage.rejected, (state, action) => {
                state.loading = false;
                state.uploadProgress = 0;
                state.error = action.payload as string;
            });

        // Update Product Image
        builder
            .addCase(updateProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductImage.fulfilled, (state, action) => {
                state.loading = false;
                const { productId, image } = action.payload;
                const images = state.imagesByProductId[productId];
                if (images) {
                    const index = images.findIndex((img) => img.id === image.id);
                    if (index !== -1) {
                        images[index] = image;
                    }
                }
            })
            .addCase(updateProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete Product Image
        builder
            .addCase(deleteProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductImage.fulfilled, (state, action) => {
                state.loading = false;
                const { productId, imageId } = action.payload;
                const images = state.imagesByProductId[productId];
                if (images) {
                    state.imagesByProductId[productId] = images.filter(
                        (img) => img.id !== imageId
                    );
                }
            })
            .addCase(deleteProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearImagesForProduct, resetUploadProgress } =
    productImageSlice.actions;
export default productImageSlice.reducer;

// Re-export ProductImage type for convenience
export type { ProductImage } from '@/types/product/product';
