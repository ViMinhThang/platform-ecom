import apiClient from '@/lib/api-client';
import { APIResponse } from '@/types/api-response';

export interface DescriptionImage {
    id: number;
    imageUrl: string;
    productId: number;
    createdAt: string;
}

export const descriptionImageService = {
    async uploadImage(productId: number, file: File): Promise<DescriptionImage> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post<APIResponse<DescriptionImage>>(
            `/api/v1/sellers/products/${productId}/description-images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data.data;
    },

    async deleteImage(productId: number, imageId: number): Promise<void> {
        await apiClient.delete<APIResponse<string>>(
            `/api/v1/sellers/products/${productId}/description-images/${imageId}`
        );
    },
};
