import { baseApi } from './baseApi';
import { ProductOption } from '@/types/product/product-option';

const API_BASE = '/api/v1/sellers/products';

export const productOptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOptions: builder.query<ProductOption[], number>({
            query: (productId) => ({
                url: `${API_BASE}/${productId}/options`,
                method: 'GET',
            }),
            providesTags: (result, error, productId) => [
                { type: 'ProductOption', id: `LIST_${productId}` },
            ],
        }),

        createOption: builder.mutation<ProductOption, { productId: number; option: ProductOption }>({
            query: ({ productId, option }) => ({
                url: `${API_BASE}/${productId}/options`,
                method: 'POST',
                body: { ...option, isRequired: Boolean(option.isRequired) },
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'ProductOption', id: `LIST_${productId}` },
            ],
        }),

        updateOption: builder.mutation<ProductOption, { productId: number; optionId: number; option: ProductOption }>({
            query: ({ productId, optionId, option }) => ({
                url: `${API_BASE}/${productId}/options/${optionId}`,
                method: 'PUT',
                body: { ...option, isRequired: Boolean(option.isRequired) },
            }),
            invalidatesTags: (result, error, { productId, optionId }) => [
                { type: 'ProductOption', id: optionId },
                { type: 'ProductOption', id: `LIST_${productId}` },
            ],
        }),

        deleteOption: builder.mutation<void, { productId: number; optionId: number }>({
            query: ({ productId, optionId }) => ({
                url: `${API_BASE}/${productId}/options/${optionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { productId, optionId }) => [
                { type: 'ProductOption', id: optionId },
                { type: 'ProductOption', id: `LIST_${productId}` },
            ],
        }),
    }),
});

export const {
    useGetOptionsQuery,
    useCreateOptionMutation,
    useUpdateOptionMutation,
    useDeleteOptionMutation,
} = productOptionApi;
