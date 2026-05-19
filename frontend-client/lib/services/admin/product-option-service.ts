import apiClient from '@/lib/api-client';
import { ProductOption } from '@/types/product/product-option';
import { APIResponse } from '@/types/api-response';

/**
 * Product Option Service
 * Handles all product option-related API calls
 * Base endpoint: /api/v1/sellers/products/{productId}/options
 */
export const productOptionService = {
    /**
     * Get all options for a product
     */
    async getOptions(productId: number): Promise<ProductOption[]> {
        const response = await apiClient.get<APIResponse<ProductOption[]>>(
            `/api/v1/sellers/products/${productId}/options`
        );
        return response.data.data;
    },

    /**
     * Create a new option for a product
     */
    async createOption(
        productId: number,
        option: ProductOption
    ): Promise<ProductOption> {
        const response = await apiClient.post<APIResponse<ProductOption>>(
            `/api/v1/sellers/products/${productId}/options`,
            { ...option, isRequired: Boolean(option.isRequired) }
        );
        return response.data.data;
    },

    /**
     * Update an existing option
     */
    async updateOption(
        productId: number,
        optionId: number,
        option: ProductOption
    ): Promise<ProductOption> {
        const response = await apiClient.put<APIResponse<ProductOption>>(
            `/api/v1/sellers/products/${productId}/options/${optionId}`,
            { ...option, isRequired: Boolean(option.isRequired) }
        );
        return response.data.data;
    },

    /**
     * Delete an option
     */
    async deleteOption(productId: number, optionId: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/sellers/products/${productId}/options/${optionId}`
        );
    },
};
