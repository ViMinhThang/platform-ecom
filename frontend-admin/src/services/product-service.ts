import axios from "axios";
import { Product } from "@/types/product";

export const getProductById = async (
  productId: number,
  token: string|undefined
): Promise<Product> => {
  const response = await axios.get<Product>(
    `http://localhost:8080/api/products/seller/${productId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const createProduct = async (
  productData: any,
  token: string|undefined
): Promise<Product> => {
  const response = await axios.post<Product>(
    "http://localhost:8080/api/products",
    productData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const updateProduct = async (
  productId: number,
  productData: any,
  token: string|undefined
): Promise<Product> => {
  const response = await axios.put<Product>(
    `http://localhost:8080/api/products/${productId}`,
    productData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
