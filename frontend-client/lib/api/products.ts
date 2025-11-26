// API functions for products and categories

import { fetcher } from "./client";
import type {
  ProductResponse,
  Product,
  CategoryResponse,
  ProductDetail,
} from "@/types/product";

export interface GetProductsParams {
  page?: number;
  perPage?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getPublicProducts(
  params: GetProductsParams = {}
): Promise<ProductResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined)
    searchParams.set("page", params.page.toString());
  if (params.perPage !== undefined)
    searchParams.set("perPage", params.perPage.toString());
  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const query = searchParams.toString();
  const endpoint = `/products/public${query ? `?${query}` : ""}`;

  return fetcher<ProductResponse>(endpoint);
}

export async function getPublicProductById(
  id: number | string
): Promise<Product> {
  return fetcher<Product>(`/products/public/${id}`);
}

export async function getPublicProductWithVariants(
  id: number | string
): Promise<ProductDetail> {
  return fetcher<ProductDetail>(`/products/public/${id}/with-variants`);
}

export interface GetCategoriesParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<CategoryResponse> {
  const searchParams = new URLSearchParams();

  if (params.pageNumber !== undefined)
    searchParams.set("pageNumber", params.pageNumber.toString());
  if (params.pageSize !== undefined)
    searchParams.set("pageSize", params.pageSize.toString());
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const query = searchParams.toString();
  const endpoint = `/categories/public${query ? `?${query}` : ""}`;

  return fetcher<CategoryResponse>(endpoint);
}
