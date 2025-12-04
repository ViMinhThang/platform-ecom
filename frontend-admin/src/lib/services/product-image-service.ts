import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';

/**
 * Product Image DTO matching backend response
 */
export interface ProductImage {
    id: number;
    imageUrl: string;
    productId: number;
    createdAt: string;
}

/**
 * Product Image Service
 * Handles all product image-related API calls
 * Base endpoint: /api/v1/sellers/products/{productId}/images
 */
export const productImageService = {
    /**
     * Fetch all images for a product
     */
    async getProductImages(productId: number): Promise<ProductImage[]> {
        const response = await apiClient.get<APIResponse<ProductImage[]>>(
            `/api/v1/sellers/products/${productId}/images`
        );
        return response.data.data || [];
    },

    /**
     * Upload a new image for a product
     */
    async uploadProductImage(
        productId: number,
        file: File
    ): Promise<ProductImage> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post<APIResponse<ProductImage>>(
            `/api/v1/sellers/products/${productId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    },

    /**
     * Update an existing product image
     */
    async updateProductImage(
        productId: number,
        imageId: number,
        file: File
    ): Promise<ProductImage> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.put<APIResponse<ProductImage>>(
            `/api/v1/sellers/products/${productId}/images/${imageId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    },

    /**
     * Delete a product image
     */
    async deleteProductImage(
        productId: number,
        imageId: number
    ): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/sellers/products/${productId}/images/${imageId}`
        );
    },
};
