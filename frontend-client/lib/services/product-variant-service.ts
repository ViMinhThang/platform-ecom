import apiClient from '@/lib/api-client';
import { VariantFormValues } from '@/types/product/product-variant';
import { APIResponse } from '@/types/api-response';

export const productVariantService = {
    async getProductVariants(
        productId: number,
        hidden?: boolean
    ): Promise<VariantFormValues[]> {
        const params = hidden !== undefined ? { hidden } : {};
        const response = await apiClient.get<APIResponse<VariantFormValues[]>>(
            `/api/v1/sellers/products/${productId}/variants`,
            { params }
        );
        return response.data.data;
    },

    async getVariantById(
        productId: number,
        variantId: number
    ): Promise<VariantFormValues> {
        const response = await apiClient.get<APIResponse<VariantFormValues>>(
            `/api/v1/sellers/products/${productId}/variants/${variantId}`
        );
        return response.data.data;
    },

    async createVariant(
        productId: number,
        variantData: VariantFormValues
    ): Promise<VariantFormValues> {
        const response = await apiClient.post<APIResponse<VariantFormValues>>(
            `/api/v1/sellers/products/${productId}/variants`,
            variantData
        );
        return response.data.data;
    },

    async updateVariant(
        productId: number,
        variantId: number,
        variantData: VariantFormValues
    ): Promise<VariantFormValues> {
        const response = await apiClient.put<APIResponse<VariantFormValues>>(
            `/api/v1/sellers/products/${productId}/variants/${variantId}`,
            variantData
        );
        return response.data.data;
    },

    async deleteVariant(productId: number, variantId: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/sellers/products/${productId}/variants/${variantId}`
        );
    },

    async toggleVisibility(
        productId: number,
        variantId: number
    ): Promise<VariantFormValues> {
        const response = await apiClient.patch<APIResponse<VariantFormValues>>(
            `/api/v1/sellers/products/${productId}/variants/${variantId}/visibility`
        );
        return response.data.data;
    },
};
