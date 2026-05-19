import apiClient from '@/lib/api-client';
import { ProductRecommendation } from '@/types/recommendation';

export const getSimilarProducts = async (productId: number, limit = 10): Promise<ProductRecommendation[]> => {
    try {
        const response = await apiClient.get(`/v1/recommendations/products/${productId}/similar?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch similar products', error);
        return [];
    }
};

export const getPersonalizedFeed = async (userId: number, limit = 24, page = 0): Promise<ProductRecommendation[]> => {
    try {
        const response = await apiClient.get(`/v1/recommendations/users/${userId}/personalized?limit=${limit}&page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch personalized feed', error);
        return [];
    }
};
