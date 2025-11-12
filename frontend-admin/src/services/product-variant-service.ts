import { VariantFormValues } from "@/types/product/product-variant";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/products/seller";

export const getProductVariants = async (
  productId: number,
  token: string
): Promise<VariantFormValues[]> => {
  if (!token) throw new Error("Token is required to fetch product variants");

  const response = await axios.get<VariantFormValues[]>(
    `${API_BASE_URL}/${productId}/variants`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
export const updateVariant = async (
  productId: number,
  variantId: number,
  productVariantData: VariantFormValues,
  token: string
): Promise<VariantFormValues> => {
  if (!token) throw new Error("Token is required to update product variant");

  const response = await axios.put<VariantFormValues>(
    `${API_BASE_URL}/${productId}/variants/${variantId}`,
    productVariantData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
export const getOptionsForProduct = async (
  productId: number,
  token: string
): Promise<string[]> => {
  if (!token) throw new Error("Token is required to fetch product options");

  const response = await axios.get<string[]>(
    `${API_BASE_URL}/${productId}/options`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
