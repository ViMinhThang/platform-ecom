// API functions for reviews

import { fetcher } from "./client";
import type { ReviewResponse, ProductReviewSummary } from "@/types/review";

export interface GetReviewsParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export async function getProductReviews(
  productId: number | string,
  params: GetReviewsParams = {}
): Promise<ReviewResponse> {
  const searchParams = new URLSearchParams();

  if (params.pageNumber !== undefined)
    searchParams.set("pageNumber", params.pageNumber.toString());
  if (params.pageSize !== undefined)
    searchParams.set("pageSize", params.pageSize.toString());
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDir) searchParams.set("sortDir", params.sortDir);

  const query = searchParams.toString();
  const endpoint = `/reviews/public/product/${productId}${query ? `?${query}` : ""
    }`;

  return fetcher<ReviewResponse>(endpoint);
}

export async function getProductReviewSummary(
  productId: number | string
): Promise<ProductReviewSummary> {
  return fetcher<ProductReviewSummary>(
    `/reviews/public/summary/product/${productId}`
  );
}

export interface CreateReviewPayload {
  productId: number;
  orderId: number;
  rating: number;
  title?: string;
  comment?: string;
}

export async function createReview(payload: CreateReviewPayload): Promise<void> {
  return fetcher(`/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
