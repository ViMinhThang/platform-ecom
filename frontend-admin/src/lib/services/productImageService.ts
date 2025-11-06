// lib/services/productImageService.ts
import { ProductImage } from "@/constants/data";
import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://localhost:8080/api/admin/products";

export const uploadProductImage = async (
  file: File,
  productId: number,
  accessToken: string
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("productId", productId.toString());

  try {
    const res = await axios.post(
      `${API_BASE_URL}/product-images/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Upload failed:", error.response?.data || error.message);
    throw new Error(`Failed to upload image ${file.name}`);
  }
};

export const deleteProductImage = async (
  imageId: number,
  accessToken: string
): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/product-images/${imageId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (err) {
    const error = err as AxiosError;
    console.error("Delete failed:", error.response?.data || error.message);
    throw new Error("Failed to delete image from server.");
  }
};

export const saveMainImages = async (
  productId: number,
  imageUrls: string[],
  accessToken: string
): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}/${productId}/main-images`,
      { imageUrls },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err) {
    const error = err as AxiosError;
    console.error("Save main images failed:", error.response?.data || error.message);
    throw new Error("Failed to save selected images.");
  }
};

export const uploadOptionValueImage = async (
  file: File,
  productId: number,
  optionValueId: number,
  accessToken: string
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("productId", productId.toString());
  formData.append("optionValueId", optionValueId.toString()); 

  try {
    const res = await axios.post(
      `${API_BASE_URL}/product-images/upload`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Option Value Image Upload failed:", error.response?.data || error.message);
    throw new Error(`Failed to upload image for option value ${optionValueId}`);
  }
};