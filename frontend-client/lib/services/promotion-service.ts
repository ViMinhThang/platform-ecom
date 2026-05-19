import { apiClient } from '../api-client';
import { VoucherDTO, DiscountResult, CalculateDiscountRequest } from '@/types/promotion.types';
import { APIResponse } from '@/types/common.types';

export const promotionService = {
    async getActiveAutoApplyVouchers(): Promise<VoucherDTO[]> {
        const response = await apiClient.get<APIResponse<VoucherDTO[]>>('/v1/vouchers/available');
        return response.data.data;
    },

    async validateVoucher(code: string, userId: number): Promise<boolean> {
        const response = await apiClient.get<APIResponse<boolean>>(`/v1/vouchers/validate/${code}`, {
            params: { userId }
        });
        return response.data.data;
    },

    async getVoucherByCode(code: string): Promise<VoucherDTO | null> {
        try {
            const response = await apiClient.get<APIResponse<VoucherDTO>>(`/v1/vouchers/code/${code}`);
            return response.data.data;
        } catch (error) {
            return null;
        }
    },

    async calculateDiscount(request: CalculateDiscountRequest): Promise<DiscountResult> {
        const response = await apiClient.post<APIResponse<DiscountResult>>('/v1/vouchers/calculate', request);
        return response.data.data;
    },

    async applyVouchers(request: CalculateDiscountRequest): Promise<DiscountResult> {
        const response = await apiClient.post<APIResponse<DiscountResult>>('/v1/vouchers/apply', request);
        return response.data.data;
    }
};
