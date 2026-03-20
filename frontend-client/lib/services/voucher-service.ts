import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';
import { Voucher, VoucherResponse, CreateVoucherRequest } from '@/types/voucher';

export const voucherService = {
    async getAll(params: {
        page?: number;
        size?: number;
        status?: string;
        category?: string;
        sortBy?: string;
        sortOrder?: string;
    } = {}): Promise<VoucherResponse> {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.set('page', params.page.toString());
        if (params.size !== undefined) searchParams.set('size', params.size.toString());
        if (params.status) searchParams.set('status', params.status);
        if (params.category) searchParams.set('category', params.category);
        if (params.sortBy) searchParams.set('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

        const query = searchParams.toString();
        const response = await apiClient.get<APIResponse<VoucherResponse>>(
            `/api/v1/admin/vouchers${query ? `?${query}` : ''}`
        );
        return response.data.data;
    },

    async getById(id: number): Promise<Voucher> {
        const response = await apiClient.get<APIResponse<Voucher>>(
            `/api/v1/admin/vouchers/${id}`
        );
        return response.data.data;
    },

    async create(data: CreateVoucherRequest): Promise<Voucher> {
        const response = await apiClient.post<APIResponse<Voucher>>(
            '/api/v1/admin/vouchers',
            data
        );
        return response.data.data;
    },

    async update(id: number, data: CreateVoucherRequest): Promise<Voucher> {
        const response = await apiClient.put<APIResponse<Voucher>>(
            `/api/v1/admin/vouchers/${id}`,
            data
        );
        return response.data.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/api/v1/admin/vouchers/${id}`);
    },

    async activate(id: number): Promise<Voucher> {
        const response = await apiClient.post<APIResponse<Voucher>>(
            `/api/v1/admin/vouchers/${id}/activate`
        );
        return response.data.data;
    },

    async cancel(id: number): Promise<Voucher> {
        const response = await apiClient.post<APIResponse<Voucher>>(
            `/api/v1/admin/vouchers/${id}/cancel`
        );
        return response.data.data;
    },
};
