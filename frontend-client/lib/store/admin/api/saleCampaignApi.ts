import { baseApi } from '../baseApi';
import { SaleCampaign, SaleCampaignResponse, SaleCampaignItem, SaleCampaignDiscountTier } from '@/types/sale-campaign';

export interface SaleCampaignParams {
    page?: number;
    size?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
}

const API_BASE = '/api/v1/admin/sale-campaigns';

export const saleCampaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSaleCampaigns: builder.query<SaleCampaignResponse, SaleCampaignParams>({
            query: (params) => ({
                url: API_BASE,
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'SaleCampaign', id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'SaleCampaign' as const, id })),
                      ]
                    : [{ type: 'SaleCampaign', id: 'LIST' }],
        }),

        getSaleCampaignById: builder.query<SaleCampaign, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'SaleCampaign', id }],
        }),

        createSaleCampaign: builder.mutation<SaleCampaign, Partial<SaleCampaign>>({
            query: (data) => ({
                url: API_BASE,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'SaleCampaign', id: 'LIST' }],
        }),

        updateSaleCampaign: builder.mutation<SaleCampaign, { id: number; data: Partial<SaleCampaign> }>({
            query: ({ id, data }) => ({
                url: `${API_BASE}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'SaleCampaign', id },
                { type: 'SaleCampaign', id: 'LIST' },
            ],
        }),

        deleteSaleCampaign: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'SaleCampaign', id },
                { type: 'SaleCampaign', id: 'LIST' },
            ],
        }),

        activateSaleCampaign: builder.mutation<SaleCampaign, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}/activate`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'SaleCampaign', id },
                { type: 'SaleCampaign', id: 'LIST' },
            ],
        }),

        cancelSaleCampaign: builder.mutation<SaleCampaign, number>({
            query: (id) => ({
                url: `${API_BASE}/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'SaleCampaign', id },
                { type: 'SaleCampaign', id: 'LIST' },
            ],
        }),

        updateSaleCampaignCategories: builder.mutation<SaleCampaign, { id: number; categoryIds: number[] }>({
            query: ({ id, categoryIds }) => ({
                url: `${API_BASE}/${id}/categories`,
                method: 'PUT',
                body: categoryIds,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'SaleCampaign', id }],
        }),

        updateSaleCampaignDiscountTiers: builder.mutation<SaleCampaign, { id: number; discountTiers: SaleCampaignDiscountTier[] }>({
            query: ({ id, discountTiers }) => ({
                url: `${API_BASE}/${id}/discount-tiers`,
                method: 'PUT',
                body: discountTiers,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'SaleCampaign', id }],
        }),

        previewSaleCampaignItems: builder.query<SaleCampaignItem[], number>({
            query: (id) => ({
                url: `${API_BASE}/${id}/preview-items`,
                method: 'GET',
            }),
        }),

        uploadSaleCampaignBanner: builder.mutation<SaleCampaign, { id: number; file: File }>({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('banner', file);
                return {
                    url: `${API_BASE}/${id}/banner`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'SaleCampaign', id },
                { type: 'SaleCampaign', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetSaleCampaignsQuery,
    useGetSaleCampaignByIdQuery,
    useCreateSaleCampaignMutation,
    useUpdateSaleCampaignMutation,
    useDeleteSaleCampaignMutation,
    useActivateSaleCampaignMutation,
    useCancelSaleCampaignMutation,
    useUpdateSaleCampaignCategoriesMutation,
    useUpdateSaleCampaignDiscountTiersMutation,
    usePreviewSaleCampaignItemsQuery,
    useUploadSaleCampaignBannerMutation,
} = saleCampaignApi;