import apiClient from '@/lib/api-client';
import { Category, CategoryResponse } from '@/types/category/category';
import { APIResponse } from '@/types/api-response';

export interface CategoryQueryParams {
    page?: number;
    size?: number;
    search?: string;
}

export const categoryService = {
    async getCategories(params?: CategoryQueryParams): Promise<CategoryResponse> {
        const response = await apiClient.get<APIResponse<CategoryResponse>>(
            '/api/v1/categories',
            { params }
        );
        return response.data.data;
    },

    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<APIResponse<Category>>(
            `/api/v1/categories/${id}`
        );
        return response.data.data;
    },

    async createCategory(
        data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Category> {
        const response = await apiClient.post<APIResponse<Category>>(
            '/api/v1/admin/categories',
            data
        );
        return response.data.data;
    },

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

    async deleteCategory(id: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/admin/categories/${id}`
        );
    },

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
