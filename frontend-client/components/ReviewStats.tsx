"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchReviewSummary } from "@/lib/store/slices/reviewSlice";
import { StarRating } from "./ui/StarRating";
import { Progress } from "./ui/progress";

interface ReviewStatsProps {
  productId: number;
}

export function ReviewStats({ productId }: ReviewStatsProps) {
  const dispatch = useAppDispatch();
  const { summary, loading } = useAppSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviewSummary(productId));
  }, [dispatch, productId]);

  if (loading && !summary) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (!summary) {
    // If not loading and no summary, it might mean no reviews or error.
    // But usually summary endpoint returns 0s if no reviews.
    // So if summary is null, it's likely still initializing or error.
    return null;
  }

  const { averageRating, totalReviews, ratingDistribution } = summary;

  if (totalReviews === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No reviews yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      {/* Overall Rating */}
      <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
        <div className="text-5xl font-bold mb-2">
          {averageRating.toFixed(1)}
        </div>
        <StarRating rating={averageRating} size="lg" />
        <p className="text-sm text-muted-foreground mt-2">
          Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star] || 0;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{star}</span>
                <span className="text-yellow-500">★</span>
              </div>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
