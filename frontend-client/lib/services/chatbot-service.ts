import { apiClient } from '../api-client';
import { ChatRequest, ChatResponse, ProductSummaryResponse } from '@/types/chatbot';

export const chatbotService = {
    /**
     * Send a message to the chatbot
     */
    async chat(request: ChatRequest): Promise<ChatResponse> {
        const response = await apiClient.post<ChatResponse>('/api/v1/chatbot/chat', request);
        return response.data;
    },

    /**
     * Get an AI summary for a specific product
     */
    async getProductSummary(slug: string): Promise<ProductSummaryResponse> {
        const response = await apiClient.get<ProductSummaryResponse>(`/api/v1/chatbot/product/${slug}/summary`);
        return response.data;
    },

    /**
     * Sync embeddings (Admin only)
     */
    async syncEmbeddings(): Promise<unknown> {
        const response = await apiClient.post('/api/v1/chatbot/embeddings/sync');
        return response.data;
    }
};

export default chatbotService;
