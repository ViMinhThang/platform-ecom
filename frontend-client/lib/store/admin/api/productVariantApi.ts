import { baseApi } from './baseApi';
import { VariantFormValues } from '@/types/product/product-variant';

export interface ProductVariantParams {
    productId: number;
    hidden?: boolean;
}

const API_BASE = '/api/v1/sellers/products';

export const productVariantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVariants: builder.query<VariantFormValues[], ProductVariantParams>({
            query: ({ productId, hidden }) => ({
                url: `${API_BASE}/${productId}/variants`,
                method: 'GET',
                params: hidden !== undefined ? { hidden } : undefined,
            }),
            providesTags: (result, error, { productId }) => [
                { type: 'ProductVariant', id: `LIST_${productId}` },
            ],
        }),

        getVariantById: builder.query<VariantFormValues, { productId: number; variantId: number }>({
            query: ({ productId, variantId }) => ({
                url: `${API_BASE}/${productId}/variants/${variantId}`,
                method: 'GET',
            }),
            providesTags: (result, error, { variantId }) => [{ type: 'ProductVariant', id: variantId }],
        }),

        createVariant: builder.mutation<VariantFormValues, { productId: number; variantData: VariantFormValues }>({
            query: ({ productId, variantData }) => ({
                url: `${API_BASE}/${productId}/variants`,
                method: 'POST',
                body: variantData,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'ProductVariant', id: `LIST_${productId}` },
            ],
        }),

        updateVariant: builder.mutation<VariantFormValues, { productId: number; variantId: number; variantData: VariantFormValues }>({
            query: ({ productId, variantId, variantData }) => ({
                url: `${API_BASE}/${productId}/variants/${variantId}`,
                method: 'PUT',
                body: variantData,
            }),
            invalidatesTags: (result, error, { productId, variantId }) => [
                { type: 'ProductVariant', id: variantId },
                { type: 'ProductVariant', id: `LIST_${productId}` },
            ],
        }),

        deleteVariant: builder.mutation<void, { productId: number; variantId: number }>({
            query: ({ productId, variantId }) => ({
                url: `${API_BASE}/${productId}/variants/${variantId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { productId, variantId }) => [
                { type: 'ProductVariant', id: variantId },
                { type: 'ProductVariant', id: `LIST_${productId}` },
            ],
        }),

        toggleVariantVisibility: builder.mutation<VariantFormValues, { productId: number; variantId: number }>({
            query: ({ productId, variantId }) => ({
                url: `${API_BASE}/${productId}/variants/${variantId}/visibility`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, { productId, variantId }) => [
                { type: 'ProductVariant', id: variantId },
                { type: 'ProductVariant', id: `LIST_${productId}` },
            ],
        }),
    }),
});

export const {
    useGetVariantsQuery,
    useGetVariantByIdQuery,
    useCreateVariantMutation,
    useUpdateVariantMutation,
    useDeleteVariantMutation,
    useToggleVariantVisibilityMutation,
} = productVariantApi;
