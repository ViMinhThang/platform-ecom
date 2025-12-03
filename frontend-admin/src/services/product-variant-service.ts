import apiClient from '@/lib/api-client';
import { VariantFormValues } from "@/types/product/product-variant";
import { APIResponse } from "@/types/api-response";

export const getProductVariants = async (
  productId: number
): Promise<VariantFormValues[]> => {
  const response = await apiClient.get<APIResponse<VariantFormValues[]>>(
    `/api/products/seller/${productId}/variants`
  );
  return response.data.data;
};

export const updateVariant = async (
  productId: number,
  variantId: number,
  productVariantData: any
): Promise<any> => {
  const response = await apiClient.put<APIResponse<any>>(
    `/api/products/seller/${productId}/variants/${variantId}`,
    productVariantData
  );
  return response.data.data;
};

export const getOptionsForProduct = async (
  productId: number
): Promise<string[]> => {
  const response = await apiClient.get<APIResponse<string[]>>(
    `/api/products/seller/${productId}/options`
  );
  return response.data.data;
};

export const createVariant = async (
  productId: number,
  productVariantData: VariantFormValues
): Promise<VariantFormValues> => {
  const response = await apiClient.post<APIResponse<VariantFormValues>>(
    `/api/products/seller/${productId}/variants`,
    productVariantData
  );
  return response.data.data;
};

export const deleteVariant = async (
  productId: number,
  variantId: number
): Promise<void> => {
  await apiClient.delete<APIResponse<string>>(
    `/api/products/seller/${productId}/variants/${variantId}`
  );
};