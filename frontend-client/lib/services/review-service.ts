import apiClient from '@/lib/api-client';
import type { ReviewResponse, ProductReviewSummary } from '@/types/review';

export interface GetReviewsParams {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface CreateReviewPayload {
    productId: number;
    orderId: number;
    rating: number;
    title?: string;
    comment?: string;
}

/**
 * Get product reviews (public - no auth required)
 */
export async function getProductReviews(
    productId: number | string,
    params: GetReviewsParams = {}
): Promise<ReviewResponse> {
    const searchParams = new URLSearchParams();

    if (params.pageNumber !== undefined)
        searchParams.set('pageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined)
        searchParams.set('pageSize', params.pageSize.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortDir) searchParams.set('sortDir', params.sortDir);

    const query = searchParams.toString();
    const endpoint = `/v1/products/${productId}/reviews${query ? `?${query}` : ''}`;

    const response = await apiClient.get<ReviewResponse>(endpoint);
    return response.data;
}

/**
 * Get product review summary (public - no auth required)
 */
export async function getProductReviewSummary(
    productId: number | string
): Promise<ProductReviewSummary> {
    const response = await apiClient.get<ProductReviewSummary>(
        `/v1/reviews/summary/product/${productId}`
    );
    return response.data;
}

/**
 * Create a review (requires auth)
 */
export async function createReview(payload: CreateReviewPayload, token: string): Promise<void> {
    await apiClient.post('/v1/reviews', payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
