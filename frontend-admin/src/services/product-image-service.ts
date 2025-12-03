import apiClient from '@/lib/api-client';
import { APIResponse } from "@/types/api-response";

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export const getProductImages = async (
  productId: number
): Promise<ProductImage[]> => {
  const res = await apiClient.get<APIResponse<ProductImage[]>>(
    `/api/product-image/${productId}/images`
  );
  return res.data.data || [];
};

export const uploadProductImage = async (
  productId: number,
  file: File
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiClient.post<APIResponse<ProductImage>>(
    `/api/product-image/${productId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
};

export const deleteProductImage = async (
  productId: number,
  imageId: number
): Promise<number> => {
  await apiClient.delete<APIResponse<string>>(
    `/api/product-image/${productId}/images/${imageId}`
  );
  return imageId;
};

export const setMainProductImage = async (
  productId: number,
  imageId: number
): Promise<ProductImage> => {
  const res = await apiClient.put<APIResponse<ProductImage>>(
    `/api/product-image/${productId}/images/${imageId}/main`,
    {}
  );

  return res.data.data;
};
