import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/common.types';
import { Product, ProductResponse, ProductDetail, Category, CategoryResponse } from '@/types/product';

export interface GetProductsParams {
    page?: number;
    perPage?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch public products (no auth required)
 */
export const getPublicProducts = async (params: GetProductsParams = {}): Promise<ProductResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.set('page', params.page.toString());
    if (params.perPage !== undefined) searchParams.set('size', params.perPage.toString());
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const query = searchParams.toString();
    const endpoint = `/v1/products${query ? `?${query}` : ''}`;

    const response = await apiClient.get<APIResponse<ProductResponse>>(endpoint);
    return response.data.data;
};

/**
 * Fetch product by ID
 */
export const getPublicProductById = async (id: number | string): Promise<Product> => {
    const response = await apiClient.get<APIResponse<Product>>(`/v1/products/${id}`);
    return response.data.data;
};

/**
 * Fetch product with variants
 */
export const getPublicProductWithVariants = async (id: number | string): Promise<ProductDetail> => {
    const response = await apiClient.get<APIResponse<ProductDetail>>(`/v1/products/${id}/with-variants`);
    return response.data.data;
};

/**
 * Fetch all categories (public - no auth required)
 */
export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<APIResponse<CategoryResponse>>('/v1/categories');
    return response.data.data.content;
};

