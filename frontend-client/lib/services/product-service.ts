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
    const endpoint = `/api/v1/products${query ? `?${query}` : ''}`;

    const response = await apiClient.get<APIResponse<ProductResponse>>(endpoint);
    return response.data.data;
};

export const getPublicProductById = async (id: number | string): Promise<Product> => {
    const response = await apiClient.get<APIResponse<Product>>(`/api/v1/products/${id}`);
    return response.data.data;
};


export const getPublicProductWithVariants = async (id: number | string): Promise<ProductDetail> => {
    const response = await apiClient.get<APIResponse<ProductDetail>>(`/api/v1/products/${id}/with-variants`);
    return response.data.data;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<APIResponse<CategoryResponse>>('/api/v1/categories');
    return response.data.data.content;
};

export interface TopSeller {
    sellerId: number;
    sellerName: string;
    imageUrl: string | null;
}


export const getTopSellers = async (categorySlug: string, limit = 10): Promise<TopSeller[]> => {
    const response = await apiClient.get<APIResponse<TopSeller[]>>(
        `/api/v1/products/categories/${encodeURIComponent(categorySlug)}/top-sellers?limit=${limit}`
    );
    return response.data.data;
};


export const getProductBySlug = async (slug: string): Promise<ProductDetail> => {
    const response = await apiClient.get<APIResponse<ProductDetail>>(`/api/v1/products/slug/${encodeURIComponent(slug)}`);
    return response.data.data;
};

export interface GetSellerProductsParams extends GetProductsParams {
    sellerId: number;
}

export const getProductsBySeller = async (params: GetSellerProductsParams): Promise<ProductResponse> => {
    const { sellerId, ...rest } = params;
    const searchParams = new URLSearchParams();

    if (rest.page !== undefined) searchParams.set('page', rest.page.toString());
    if (rest.perPage !== undefined) searchParams.set('size', rest.perPage.toString());
    if (rest.category) searchParams.set('category', rest.category);
    if (rest.search) searchParams.set('search', rest.search);
    if (rest.sortBy) searchParams.set('sortBy', rest.sortBy);
    if (rest.sortOrder) searchParams.set('sortOrder', rest.sortOrder);
    if (rest.minPrice !== undefined) searchParams.set('minPrice', rest.minPrice.toString());
    if (rest.maxPrice !== undefined) searchParams.set('maxPrice', rest.maxPrice.toString());
    if (rest.minRating !== undefined) searchParams.set('minRating', rest.minRating.toString());

    const query = searchParams.toString();
    const endpoint = `/api/v1/products/seller/${sellerId}${query ? `?${query}` : ''}`;

    const response = await apiClient.get<APIResponse<ProductResponse>>(endpoint);
    return response.data.data;
};

// Admin Product Service
export const productService = {
    getProducts: async (params: { size?: number } = {}): Promise<ProductResponse> => {
        const searchParams = new URLSearchParams();
        if (params.size !== undefined) searchParams.set('size', params.size.toString());
        const query = searchParams.toString();
        const response = await apiClient.get<APIResponse<ProductResponse>>(
            `/api/v1/sellers/products${query ? `?${query}` : ''}`
        );
        return response.data.data;
    },
    getById: async (id: number): Promise<Product> => {
        const response = await apiClient.get<APIResponse<Product>>(`/api/v1/sellers/products/${id}`);
        return response.data.data;
    },
    getProductById: async (id: number): Promise<Product> => {
        const response = await apiClient.get<APIResponse<Product>>(`/api/v1/sellers/products/${id}`);
        return response.data.data;
    },
    updateDescription: async (id: number, description: string): Promise<Product> => {
        const response = await apiClient.put<APIResponse<Product>>(
            `/api/v1/sellers/products/${id}/description`,
            { description }
        );
        return response.data.data;
    },
    updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
        const response = await apiClient.put<APIResponse<Product>>(
            `/api/v1/sellers/products/${id}`,
            data
        );
        return response.data.data;
    },
};

