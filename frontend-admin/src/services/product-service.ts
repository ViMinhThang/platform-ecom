import axios from "axios";
import { Product, ProductRow } from "@/types/product/product";
import { PaginatedProducts } from "@/types/product/product";

const API_BASE_URL = "http://localhost:8080/api/products/seller";

export const getProducts = async (
  token: string | undefined,
  params?: { page?: string; perPage?: string; name?: string; category?: string }
): Promise<PaginatedProducts> => {
  if (!token) throw new Error("Token is required to fetch products");

  const response = await axios.get<PaginatedProducts>(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};

export const getProductById = async (
  productId: number,
  token: string | undefined
): Promise<Product> => {
  if (!token) throw new Error("Token is required to fetch product");

  const response = await axios.get<Product>(`${API_BASE_URL}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const createProduct = async (
  productData: any,
  token: string | undefined
): Promise<ProductRow> => {
  if (!token) throw new Error("Token is required to create product");

  const response = await axios.post<ProductRow>(API_BASE_URL, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateProduct = async (
  productId: number,
  productData: any,
  token: string | undefined
): Promise<Product> => {
  if (!token) throw new Error("Token is required to update product");

  const response = await axios.put<Product>(`${API_BASE_URL}/${productId}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
