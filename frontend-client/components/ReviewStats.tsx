// Server Component - Review Statistics Summary

import { getProductReviewSummary } from "@/lib/api/reviews";
import { StarRating } from "./ui/StarRating";
import { Progress } from "./ui/progress";

interface ReviewStatsProps {
  productId: number;
}

export async function ReviewStats({ productId }: ReviewStatsProps) {
  let summary;

  try {
    summary = await getProductReviewSummary(productId);
  } catch (error) {
    console.error("Failed to fetch review summary:", error);
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Unable to load review statistics</p>
      </div>
    );
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
