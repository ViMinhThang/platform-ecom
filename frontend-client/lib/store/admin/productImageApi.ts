import { baseApi } from './baseApi';

export interface ProductImage {
    id: number;
    imageUrl: string;
    productId: number;
    isMain: boolean;
    createdAt: string;
}

const API_BASE = '/api/v1/sellers/products';

export const productImageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductImages: builder.query<ProductImage[], number>({
            query: (productId) => ({
                url: `${API_BASE}/${productId}/images`,
                method: 'GET',
            }),
            providesTags: (result, error, productId) => [
                { type: 'ProductImage', id: `LIST_${productId}` },
            ],
        }),

        uploadProductImage: builder.mutation<ProductImage, { productId: number; file: File }>({
            query: ({ productId, file }) => {
                const formData = new FormData();
                formData.append('image', file);
                return {
                    url: `${API_BASE}/${productId}/images`,
                    method: 'POST',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: (result, error, { productId }) => [
                { type: 'ProductImage', id: `LIST_${productId}` },
            ],
        }),

        updateProductImage: builder.mutation<ProductImage, { productId: number; imageId: number; file: File }>({
            query: ({ productId, imageId, file }) => {
                const formData = new FormData();
                formData.append('image', file);
                return {
                    url: `${API_BASE}/${productId}/images/${imageId}`,
                    method: 'PUT',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: (result, error, { productId, imageId }) => [
                { type: 'ProductImage', id: imageId },
                { type: 'ProductImage', id: `LIST_${productId}` },
            ],
        }),

        deleteProductImage: builder.mutation<void, { productId: number; imageId: number }>({
            query: ({ productId, imageId }) => ({
                url: `${API_BASE}/${productId}/images/${imageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { productId, imageId }) => [
                { type: 'ProductImage', id: imageId },
                { type: 'ProductImage', id: `LIST_${productId}` },
            ],
        }),
    }),
});

export const {
    useGetProductImagesQuery,
    useUploadProductImageMutation,
    useUpdateProductImageMutation,
    useDeleteProductImageMutation,
} = productImageApi;
