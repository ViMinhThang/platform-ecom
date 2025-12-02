import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/types/user';
import { Product, ProductResponse, ProductDetail, Category } from '@/types/product';

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
    if (params.perPage !== undefined) searchParams.set('perPage', params.perPage.toString());
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const query = searchParams.toString();
    const endpoint = `/products/public${query ? `?${query}` : ''}`;

    const response = await apiClient.get<ProductResponse>(endpoint);
    return response.data;
};

/**
 * Fetch product by ID
 */
export const getPublicProductById = async (id: number | string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/public/${id}`);
    return response.data.data;
};

/**
 * Fetch product with variants
 */
export const getPublicProductWithVariants = async (id: number | string): Promise<ProductDetail> => {
    const response = await apiClient.get<ApiResponse<ProductDetail>>(`/products/public/${id}/with-variants`);
    return response.data.data;
};

/**
 * Fetch all categories (public - no auth required)
 */
export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/public');
    return response.data.data;
};
