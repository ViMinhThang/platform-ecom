import apiClient from '@/lib/api-client';
import { Category, CategoryResponse } from '@/types/category/category';
import { APIResponse } from '@/types/api-response';

/**
 * Query parameters for fetching categories
 */
export interface CategoryQueryParams {
    page?: number;
    size?: number;
    search?: string;
}

/**
 * Category Service
 * Handles all category-related API calls
 * Endpoints: /api/v1/categories (public), /api/v1/admin/categories (admin)
 */
export const categoryService = {
    /**
     * Fetch paginated categories (public endpoint)
     */
    async getCategories(params?: CategoryQueryParams): Promise<CategoryResponse> {
        const response = await apiClient.get<APIResponse<CategoryResponse>>(
            '/api/v1/categories',
            { params }
        );
        return response.data.data;
    },

    /**
     * Fetch a single category by ID (public endpoint)
     */
    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<APIResponse<Category>>(
            `/api/v1/categories/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new category (admin endpoint)
     */
    async createCategory(
        data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Category> {
        const response = await apiClient.post<APIResponse<Category>>(
            '/api/v1/admin/categories',
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing category (admin endpoint)
     */
    async updateCategory(
        id: number,
        data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<Category> {
        const response = await apiClient.put<APIResponse<Category>>(
            `/api/v1/admin/categories/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a category (admin endpoint)
     */
    async deleteCategory(id: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/admin/categories/${id}`
        );
    },

    /**
     * Update category image (admin endpoint)
     */
    async updateCategoryImage(id: number, file: File): Promise<Category> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.put<APIResponse<Category>>(
            `/api/v1/admin/categories/${id}/image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },
};
