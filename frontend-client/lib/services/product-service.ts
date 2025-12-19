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
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}


export const getPublicProducts = async (params: GetProductsParams = {}): Promise<ProductResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.set('page', params.page.toString());
    if (params.perPage !== undefined) searchParams.set('size', params.perPage.toString());
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    if (params.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params.minRating !== undefined) searchParams.set('minRating', params.minRating.toString());

    const query = searchParams.toString();
    const endpoint = `/v1/products${query ? `?${query}` : ''}`;

    const response = await apiClient.get<APIResponse<ProductResponse>>(endpoint);
    return response.data.data;
};

export const getPublicProductById = async (id: number | string): Promise<Product> => {
    const response = await apiClient.get<APIResponse<Product>>(`/v1/products/${id}`);
    return response.data.data;
};


export const getPublicProductWithVariants = async (id: number | string): Promise<ProductDetail> => {
    const response = await apiClient.get<APIResponse<ProductDetail>>(`/v1/products/${id}/with-variants`);
    return response.data.data;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<APIResponse<CategoryResponse>>('/v1/categories');
    return response.data.data.content;
};

export interface TopSeller {
    sellerId: number;
    sellerName: string;
    imageUrl: string | null;
}


export const getTopSellers = async (categorySlug: string, limit = 10): Promise<TopSeller[]> => {
    const response = await apiClient.get<APIResponse<TopSeller[]>>(
        `/v1/products/categories/${encodeURIComponent(categorySlug)}/top-sellers?limit=${limit}`
    );
    return response.data.data;
};


export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
    const response = await apiClient.get<APIResponse<ProductDetail>>(`/v1/products/slug/${encodeURIComponent(slug)}`);
    return response.data.data;
};

