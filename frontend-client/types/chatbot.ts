export interface ProductSummary {
    id: number;
    name: string;
    slug: string;
    description: string;
    categoryName: string;
    price: number;
    averageRating: number;
    totalSold: number;
    similarityScore: number;
    imageUrl?: string;
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
    productSlug?: string;
    productId?: number;
    limit?: number;
}

export interface ChatResponse {
    message: string;
    products: ProductSummary[];
    showSupportInfo?: boolean;
    timestamp: string;
    processingTimeMs: number;
}

export interface ProductSummaryResponse {
    summary: string;
    productId: number;
    productName: string;
}
