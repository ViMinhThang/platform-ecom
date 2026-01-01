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
}

export interface ChatRequest {
    message: string;
    productSlug?: string;
    productId?: number;
    limit?: number;
}

export interface ChatResponse {
    message: string;
    products: ProductSummary[];
    timestamp: string;
    processingTimeMs: number;
}

export interface ProductSummaryResponse {
    summary: string;
    productId: number;
    productName: string;
}
