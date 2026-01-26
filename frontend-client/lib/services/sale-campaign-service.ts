import apiClient from '@/lib/api-client';
import { APIResponse, PaginatedResponse } from '@/types/common.types';
import { SaleCampaign, SaleCampaignItem } from '@/types/sale-campaign';

/**
 * Sale Campaign Service for Customer View
 * Handles public sale campaign endpoints
 */

export const getActiveSaleCampaigns = async (): Promise<SaleCampaign[]> => {
    const response = await apiClient.get<APIResponse<SaleCampaign[]>>('/v1/sale-campaigns/active');
    return response.data.data;
};

export const getSaleCampaignBySlug = async (slug: string): Promise<SaleCampaign> => {
    const response = await apiClient.get<APIResponse<SaleCampaign>>(
        `/v1/sale-campaigns/${encodeURIComponent(slug)}`
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
        `/v1/sale-campaigns/${encodeURIComponent(slug)}/items`,
        { params }
    );
    return response.data.data;
};

export const getSaleCampaignPriceForVariant = async (variantId: number): Promise<SaleCampaignItem | null> => {
    const response = await apiClient.get<APIResponse<SaleCampaignItem | null>>(
        `/v1/sale-campaigns/variant/${variantId}/price`
    );
    return response.data.data;
};
