import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';
import {
    FlashSale,
    FlashSaleResponse,
    CreateFlashSaleRequest,
    UpdateFlashSaleRequest,
    AddFlashSaleItemRequest,
    UpdateFlashSaleItemRequest,
} from '@/types/flash-sale';


export const flashSaleService = {

    async getAll(params: {
        page?: number;
        size?: number;
        status?: string;
        sortBy?: string;
        sortOrder?: string;
    } = {}): Promise<FlashSaleResponse> {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', params.page.toString());
        if (params.size !== undefined) searchParams.set('size', params.size.toString());
        if (params.status) searchParams.set('status', params.status);
        if (params.sortBy) searchParams.set('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

        const query = searchParams.toString();
        const response = await apiClient.get<APIResponse<FlashSaleResponse>>(
            `/api/v1/admin/flash-sales${query ? `?${query}` : ''}`
        );
        return response.data.data;
    },


    async getById(id: number): Promise<FlashSale> {
        const response = await apiClient.get<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${id}`
        );
        return response.data.data;
    },


    async create(data: CreateFlashSaleRequest): Promise<FlashSale> {
        const response = await apiClient.post<APIResponse<FlashSale>>(
            '/api/v1/admin/flash-sales',
            data
        );
        return response.data.data;
    },

    async update(id: number, data: UpdateFlashSaleRequest): Promise<FlashSale> {
        const response = await apiClient.put<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${id}`,
            data
        );
        return response.data.data;
    },


    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/v1/admin/flash-sales/${id}`);
    },


    async addItems(id: number, items: AddFlashSaleItemRequest[]): Promise<FlashSale> {
        const response = await apiClient.post<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${id}/items`,
            items
        );
        return response.data.data;
    },


    async removeItem(flashSaleId: number, itemId: number): Promise<FlashSale> {
        const response = await apiClient.delete<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${flashSaleId}/items/${itemId}`
        );
        return response.data.data;
    },


    async updateItem(
        flashSaleId: number,
        itemId: number,
        data: UpdateFlashSaleItemRequest
    ): Promise<FlashSale> {
        const response = await apiClient.put<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${flashSaleId}/items/${itemId}`,
            data
        );
        return response.data.data;
    },


    async activate(id: number): Promise<FlashSale> {
        const response = await apiClient.post<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${id}/activate`
        );
        return response.data.data;
    },


    async cancel(id: number): Promise<FlashSale> {
        const response = await apiClient.post<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${id}/cancel`
        );
        return response.data.data;
    },

    async uploadBanner(id: number, file: File): Promise<FlashSale> {
        const formData = new FormData();
        formData.append('banner', file);

        const response = await apiClient.post<APIResponse<FlashSale>>(
            `/api/v1/admin/flash-sales/${id}/banner`,
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
