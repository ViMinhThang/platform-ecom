import apiClient from '@/lib/api-client';
import { ProductOption } from "@/types/product/product-option";
import { APIResponse } from "@/types/api-response";

export const productOptionService = {
  async getOptions(productId: number) {
    const res = await apiClient.get<APIResponse<ProductOption[]>>(
      `/api/products/seller/${productId}/options`
    );
    return res.data.data;
  },

  async createOption(productId: number, option: ProductOption) {
    const res = await apiClient.post<APIResponse<ProductOption>>(
      `/api/products/seller/product-options/${productId}`,
      { ...option, isRequired: Boolean(option.isRequired) }
    );
    return res.data.data;
  },

  async updateOption(productId: number, optionId: number, option: ProductOption) {
    const res = await apiClient.put<APIResponse<ProductOption>>(
      `/api/products/seller/product-options/${productId}/${optionId}`,
      { ...option, isRequired: Boolean(option.isRequired) }
    );
    return res.data.data;
  },

  async deleteOption(productId: number, optionId: number) {
    await apiClient.delete<APIResponse<string>>(
      `/api/products/seller/product-options/${productId}/${optionId}`
    );
  },
};
