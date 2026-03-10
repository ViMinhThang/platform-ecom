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
    comment?: string;
    email: string;
}



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
    const endpoint = `/v1/reviews/public/product/${productId}${query ? `?${query}` : ''}`;

    const response = await apiClient.get<ReviewResponse>(endpoint);
    return response.data;
}


export async function getProductReviewSummary(
    productId: number | string
): Promise<ProductReviewSummary> {
    const response = await apiClient.get<ProductReviewSummary>(
        `/v1/reviews/public/summary/product/${productId}`
    );
    return response.data;
}


export async function createReview(
    payload: CreateReviewPayload,
    token: string,
    images?: File[]
): Promise<void> {
    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append('images', image);
        });
    }

    await apiClient.post('/v1/reviews', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
}

