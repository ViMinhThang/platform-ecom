import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/product-image";

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export const getProductImages = async (
  productId: number,
  token: string
): Promise<ProductImage[]> => {
  const res = await axios.get(`${API_BASE_URL}/${productId}/images`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const uploadProductImage = async (
  productId: number,
  file: File,
  token: string
): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(`${API_BASE_URL}/${productId}/images`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteProductImage = async (
  productId: number,
  imageId: number,
  token: string
): Promise<number> => {
  await axios.delete(`${API_BASE_URL}/${productId}/images/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return imageId;
};

export const setMainProductImage = async (
  productId: number,
  imageId: number,
  token: string
): Promise<ProductImage> => {
  const res = await axios.put(
    `${API_BASE_URL}/${productId}/images/${imageId}/main`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
