import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/common.types';
import { FlashSale, FlashSaleItem } from '@/types/flash-sale';

/**
 * Flash Sale Service for Customer View
 * Handles public flash sale endpoints
 */

export const getActiveFlashSales = async (): Promise<FlashSale[]> => {
    const response = await apiClient.get<APIResponse<FlashSale[]>>('/v1/sale-campaigns/active');
    return response.data.data;
};

export const getFlashSaleBySlug = async (slug: string): Promise<FlashSale> => {
    const response = await apiClient.get<APIResponse<FlashSale>>(
        `/v1/sale-campaigns/${encodeURIComponent(slug)}`
    );
    return response.data.data;
};

export const getFlashSaleItems = async (slug: string, limit = 20): Promise<FlashSaleItem[]> => {
    const response = await apiClient.get<APIResponse<FlashSaleItem[]>>(
        `/v1/sale-campaigns/${encodeURIComponent(slug)}/items?limit=${limit}`
    );
    return response.data.data;
};

export const getFlashSalePriceForVariant = async (variantId: number): Promise<FlashSaleItem | null> => {
    const response = await apiClient.get<APIResponse<FlashSaleItem | null>>(
        `/v1/sale-campaigns/variant/${variantId}/price`
    );
    return response.data.data;
};
