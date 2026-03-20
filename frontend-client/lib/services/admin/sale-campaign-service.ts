import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';
import {
    SaleCampaign,
    SaleCampaignResponse,
    SaleCampaignItem,
    CreateSaleCampaignRequest,
    UpdateSaleCampaignRequest,
    SaleCampaignDiscountTier,
} from '@/types/sale-campaign';


export const saleCampaignService = {

    async getAll(params: {
        page?: number;
        size?: number;
        status?: string;
        sortBy?: string;
        sortOrder?: string;
    } = {}): Promise<SaleCampaignResponse> {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', params.page.toString());
        if (params.size !== undefined) searchParams.set('size', params.size.toString());
        if (params.status) searchParams.set('status', params.status);
        if (params.sortBy) searchParams.set('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

        const query = searchParams.toString();
        const response = await apiClient.get<APIResponse<SaleCampaignResponse>>(
            `/api/v1/admin/sale-campaigns${query ? `?${query}` : ''}`
        );
        return response.data.data;
    },


    async getById(id: number): Promise<SaleCampaign> {
        const response = await apiClient.get<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}`
        );
        return response.data.data;
    },


    async create(data: CreateSaleCampaignRequest): Promise<SaleCampaign> {
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            '/api/v1/admin/sale-campaigns',
            data
        );
        return response.data.data;
    },

    async update(id: number, data: UpdateSaleCampaignRequest): Promise<SaleCampaign> {
        const response = await apiClient.put<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}`,
            data
        );
        return response.data.data;
    },


    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/v1/admin/sale-campaigns/${id}`);
    },


    async updateCategories(id: number, categoryIds: number[]): Promise<SaleCampaign> {
        const response = await apiClient.put<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/categories`,
            categoryIds
        );
        return response.data.data;
    },


    async updateDiscountTiers(id: number, tiers: SaleCampaignDiscountTier[]): Promise<SaleCampaign> {
        const response = await apiClient.put<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/discount-tiers`,
            tiers
        );
        return response.data.data;
    },


    async previewItems(id: number): Promise<SaleCampaignItem[]> {
        const response = await apiClient.get<APIResponse<SaleCampaignItem[]>>(
            `/api/v1/admin/sale-campaigns/${id}/preview-items`
        );
        return response.data.data;
    },


    async activate(id: number): Promise<SaleCampaign> {
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/activate`
        );
        return response.data.data;
    },


    async cancel(id: number): Promise<SaleCampaign> {
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/cancel`
        );
        return response.data.data;
    },

    async uploadBanner(id: number, file: File): Promise<SaleCampaign> {
        const formData = new FormData();
        formData.append('banner', file);

        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/banner`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },
};
