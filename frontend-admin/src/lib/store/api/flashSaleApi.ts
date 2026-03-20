import { baseApi } from './baseApi';
import {
    FlashSale,
    FlashSaleResponse,
    CreateFlashSaleRequest,
    UpdateFlashSaleRequest,
    AddFlashSaleItemRequest,
    UpdateFlashSaleItemRequest,
} from '@/types/flash-sale';

export interface FlashSaleParams {
    page?: number;
    size?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
}

const API_BASE = '/api/v1/admin/flash-sales';

export const flashSaleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFlashSales: builder.query<FlashSaleResponse, FlashSaleParams | undefined>({
            query: (params = {}) => ({
                url: API_BASE,
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'FlashSale', id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'FlashSale' as const, id })),
                      ]
                    : [{ type: 'FlashSale', id: 'LIST' }],
        }),

        getFlashSaleById: builder.query<FlashSale, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'FlashSale', id }],
        }),

        createFlashSale: builder.mutation<FlashSale, CreateFlashSaleRequest>({
            query: (data) => ({
                url: API_BASE,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'FlashSale', id: 'LIST' }],
        }),

        updateFlashSale: builder.mutation<FlashSale, { id: number; data: UpdateFlashSaleRequest }>({
            query: ({ id, data }) => ({
                url: `${API_BASE}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'FlashSale', id },
                { type: 'FlashSale', id: 'LIST' },
            ],
        }),

        deleteFlashSale: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'FlashSale', id },
                { type: 'FlashSale', id: 'LIST' },
            ],
        }),

        addFlashSaleItems: builder.mutation<FlashSale, { id: number; items: AddFlashSaleItemRequest[] }>({
            query: ({ id, items }) => ({
                url: `${API_BASE}/${id}/items`,
                method: 'POST',
                body: items,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'FlashSale', id },
                { type: 'FlashSale', id: 'LIST' },
            ],
        }),

        removeFlashSaleItem: builder.mutation<FlashSale, { flashSaleId: number; itemId: number }>({
            query: ({ flashSaleId, itemId }) => ({
                url: `${API_BASE}/${flashSaleId}/items/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { flashSaleId }) => [
                { type: 'FlashSale', id: flashSaleId },
                { type: 'FlashSale', id: 'LIST' },
            ],
        }),

        updateFlashSaleItem: builder.mutation<FlashSale, { flashSaleId: number; itemId: number; data: UpdateFlashSaleItemRequest }>({
            query: ({ flashSaleId, itemId, data }) => ({
                url: `${API_BASE}/${flashSaleId}/items/${itemId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { flashSaleId }) => [
                { type: 'FlashSale', id: flashSaleId },
            ],
        }),

        activateFlashSale: builder.mutation<FlashSale, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}/activate`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'FlashSale', id },
                { type: 'FlashSale', id: 'LIST' },
            ],
        }),

        cancelFlashSale: builder.mutation<FlashSale, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'FlashSale', id },
                { type: 'FlashSale', id: 'LIST' },
            ],
        }),

        uploadFlashSaleBanner: builder.mutation<FlashSale, { id: number; file: File }>({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('banner', file);
                return {
                    url: `${API_BASE}/${id}/banner`,
                    method: 'POST',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'FlashSale', id }],
        }),
    }),
});

export const {
    useGetFlashSalesQuery,
    useGetFlashSaleByIdQuery,
    useCreateFlashSaleMutation,
    useUpdateFlashSaleMutation,
    useDeleteFlashSaleMutation,
    useAddFlashSaleItemsMutation,
    useRemoveFlashSaleItemMutation,
    useUpdateFlashSaleItemMutation,
    useActivateFlashSaleMutation,
    useCancelFlashSaleMutation,
    useUploadFlashSaleBannerMutation,
} = flashSaleApi;
