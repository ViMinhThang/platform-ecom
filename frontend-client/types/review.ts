// TypeScript interfaces matching backend ReviewDTO and ProductReviewSummaryDTO

export interface Review {
  id: number;
  productId: number;
  userId: number;
  orderId?: number | null;
  email: string;
  rating: number; // 1-5
  comment?: string;
  images?: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  sentiment: string; // POSITIVE, NEUTRAL, NEGATIVE
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  content: Review[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface ProductReviewSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // rating -> count
}
