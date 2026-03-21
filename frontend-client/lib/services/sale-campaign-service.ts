import apiClient from '@/lib/api-client';
import { APIResponse, PaginatedResponse } from '@/types/common.types';
import { SaleCampaign, SaleCampaignItem } from '@/types/sale-campaign';

/**
 * Sale Campaign Service for Customer View
 * Handles public sale campaign endpoints
 */

export const getActiveSaleCampaigns = async (): Promise<SaleCampaign[]> => {
    const response = await apiClient.get<APIResponse<SaleCampaign[]>>('/api/v1/sale-campaigns/active');
    return response.data.data;
};

export const getSaleCampaignBySlug = async (slug: string): Promise<SaleCampaign> => {
    const response = await apiClient.get<APIResponse<SaleCampaign>>(
        `/api/v1/sale-campaigns/${encodeURIComponent(slug)}`
    );
    return response.data.data;
};

export const getSaleCampaignItems = async (
    slug: string, 
    params?: {
        minPrice?: number;
        maxPrice?: number;
        inStockOnly?: boolean;
        page?: number;
        size?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
): Promise<PaginatedResponse<SaleCampaignItem>> => {
    const response = await apiClient.get<APIResponse<PaginatedResponse<SaleCampaignItem>>>(
        `/api/v1/sale-campaigns/${encodeURIComponent(slug)}/items`,
        { params }
    );
    return response.data.data;
};

export const getSaleCampaignPriceForVariant = async (variantId: number): Promise<SaleCampaignItem | null> => {
    const response = await apiClient.get<APIResponse<SaleCampaignItem | null>>(
        `/api/v1/sale-campaigns/variant/${variantId}/price`
    );
    return response.data.data;
};

// Admin Sale Campaign Service
export const saleCampaignService = {
    getAll: async (params?: { page?: number; size?: number }): Promise<{ content: SaleCampaign[]; totalElements: number }> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set('page', params.page.toString());
        if (params?.size !== undefined) searchParams.set('size', params.size.toString());
        const query = searchParams.toString();
        const response = await apiClient.get<APIResponse<{ content: SaleCampaign[]; totalElements: number }>>(
            `/api/v1/admin/sale-campaigns${query ? `?${query}` : ''}`
        );
        return response.data.data;
    },
    getById: async (id: number): Promise<SaleCampaign> => {
        const response = await apiClient.get<APIResponse<SaleCampaign>>(`/api/v1/admin/sale-campaigns/${id}`);
        return response.data.data;
    },
    create: async (data: Partial<SaleCampaign>): Promise<SaleCampaign> => {
        const response = await apiClient.post<APIResponse<SaleCampaign>>('/api/v1/admin/sale-campaigns', data);
        return response.data.data;
    },
    update: async (id: number, data: Partial<SaleCampaign>): Promise<SaleCampaign> => {
        const response = await apiClient.put<APIResponse<SaleCampaign>>(`/api/v1/admin/sale-campaigns/${id}`, data);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/v1/admin/sale-campaigns/${id}`);
    },
    addItems: async (id: number, items: unknown[]): Promise<SaleCampaign> => {
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/items`,
            items
        );
        return response.data.data;
    },
    activate: async (id: number): Promise<SaleCampaign> => {
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/activate`
        );
        return response.data.data;
    },
    cancel: async (id: number): Promise<SaleCampaign> => {
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/cancel`
        );
        return response.data.data;
    },
    updateCategories: async (id: number, categoryIds: number[]): Promise<SaleCampaign> => {
        const response = await apiClient.put<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/categories`,
            { categoryIds }
        );
        return response.data.data;
    },
    updateDiscountTiers: async (id: number, discountTiers: unknown[]): Promise<SaleCampaign> => {
        const response = await apiClient.put<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/discount-tiers`,
            { discountTiers }
        );
        return response.data.data;
    },
    uploadBanner: async (id: number, file: File): Promise<SaleCampaign> => {
        const formData = new FormData();
        formData.append('banner', file);
        const response = await apiClient.post<APIResponse<SaleCampaign>>(
            `/api/v1/admin/sale-campaigns/${id}/banner`,
            formData
        );
        return response.data.data;
    },
};
