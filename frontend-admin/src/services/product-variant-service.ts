import { VariantFormValues } from "@/types/product/product-variant";
import { APIResponse } from "@/types/api-response";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/products/seller";

export const getProductVariants = async (
  productId: number,
  token: string
): Promise<VariantFormValues[]> => {
  if (!token) throw new Error("Token is required to fetch product variants");

  const response = await axios.get<APIResponse<VariantFormValues[]>>(
    `${API_BASE_URL}/${productId}/variants`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data;
};

export const updateVariant = async (
  productId: number,
  variantId: number,
  productVariantData: any,
  token: string
): Promise<any> => {
  if (!token) throw new Error("Token is required to update product variant");

  const response = await axios.put<APIResponse<any>>(
    `${API_BASE_URL}/${productId}/variants/${variantId}`,
    productVariantData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data;
};

export const getOptionsForProduct = async (
  productId: number,
  token: string
): Promise<string[]> => {
  if (!token) throw new Error("Token is required to fetch product options");

  const response = await axios.get<APIResponse<string[]>>(
    `${API_BASE_URL}/${productId}/options`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.data;
};

export const createVariant = async (
  productId: number,
  productVariantData: VariantFormValues,
  token: string
): Promise<VariantFormValues> => {
  if (!token) throw new Error("Token is required to create product variant");

  const response = await axios.post<APIResponse<VariantFormValues>>(
    `${API_BASE_URL}/${productId}/variants`,
    productVariantData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data;
};

export const deleteVariant = async (
  productId: number,
  variantId: number,
  token: string
): Promise<void> => {
  if (!token) throw new Error("Token is required to delete product variant");

  await axios.delete<APIResponse<string>>(`${API_BASE_URL}/${productId}/variants/${variantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};  