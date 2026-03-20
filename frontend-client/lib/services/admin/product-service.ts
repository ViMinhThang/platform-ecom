import apiClient from '@/lib/api-client';
import { Product, ProductRow, PaginatedProducts } from '@/types/product/product';
import { APIResponse } from '@/types/api-response';

/**
 * Query parameters for fetching products
 */
export interface ProductQueryParams {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
}

/**
 * Product Service
 * Handles all product-related API calls for sellers
 * Base endpoint: /api/v1/sellers/products
 */
export const productService = {
    /**
     * Fetch paginated products with optional filters
     */
    async getProducts(params?: ProductQueryParams): Promise<PaginatedProducts> {
        const response = await apiClient.get<APIResponse<PaginatedProducts>>(
            '/api/v1/sellers/products',
            { params }
        );
        return response.data.data;
    },

    /**
     * Fetch a single product by ID
     */
    async getProductById(id: number): Promise<Product> {
        const response = await apiClient.get<APIResponse<Product>>(
            `/api/v1/sellers/products/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new product
     */
    async createProduct(
        data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<ProductRow> {
        const response = await apiClient.post<APIResponse<ProductRow>>(
            '/api/v1/sellers/products',
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing product
     */
    async updateProduct(
        id: number,
        data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<Product> {
        const response = await apiClient.put<APIResponse<Product>>(
            `/api/v1/sellers/products/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a product
     */
    async deleteProduct(id: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/sellers/products/${id}`
        );
    },
};
