import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductImage } from '@/types/product/product';

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

const productImageSlice = createSlice({
    name: 'productImages',
    initialState,
    reducers: {
        setImagesForProduct: (state, action: PayloadAction<{ productId: number; images: ProductImage[] }>) => {
            state.imagesByProductId[action.payload.productId] = action.payload.images;
        },
        addImageToProduct: (state, action: PayloadAction<{ productId: number; image: ProductImage }>) => {
            const { productId, image } = action.payload;
            if (!state.imagesByProductId[productId]) {
                state.imagesByProductId[productId] = [];
            }
            state.imagesByProductId[productId].push(image);
        },
        updateImageInProduct: (state, action: PayloadAction<{ productId: number; image: ProductImage }>) => {
            const { productId, image } = action.payload;
            const images = state.imagesByProductId[productId];
            if (images) {
                const index = images.findIndex((img) => img.id === image.id);
                if (index !== -1) {
                    images[index] = image;
                }
            }
        },
        removeImageFromProduct: (state, action: PayloadAction<{ productId: number; imageId: number }>) => {
            const { productId, imageId } = action.payload;
            const images = state.imagesByProductId[productId];
            if (images) {
                state.imagesByProductId[productId] = images.filter((img) => img.id !== imageId);
            }
        },
        clearImagesForProduct: (state, action: PayloadAction<number>) => {
            delete state.imagesByProductId[action.payload];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetUploadProgress: (state) => {
            state.uploadProgress = 0;
        },
    },
});

export const {
    setImagesForProduct,
    addImageToProduct,
    updateImageInProduct,
    removeImageFromProduct,
    clearImagesForProduct,
    setLoading,
    setUploadProgress,
    setError,
    clearError,
    resetUploadProgress,
} = productImageSlice.actions;

export default productImageSlice.reducer;

export type { ProductImage } from '@/types/product/product';
