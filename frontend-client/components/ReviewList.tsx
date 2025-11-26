"use client";

// Client Component - Paginated Review List

import { useEffect, useState } from "react";
import { getProductReviews, GetReviewsParams } from "@/lib/api/reviews";
import type { Review } from "@/types/review";
import { StarRating } from "./ui/StarRating";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";

interface ReviewListProps {
  productId: number;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      setError(null);

      try {
        const params: GetReviewsParams = {
          pageNumber: page,
          pageSize: 10,
          sortBy,
          sortDir,
        };

        const response = await getProductReviews(productId, params);
        setReviews(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("Failed to load reviews");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId, page, sortBy, sortDir]);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDir] = value.split("-");
    setSortBy(newSortBy);
    setSortDir(newSortDir as "asc" | "desc");
    setPage(0); // Reset to first page
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Selector */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </h3>
        <Select value={`${sortBy}-${sortDir}`} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="rating-asc">Lowest Rated</SelectItem>
            <SelectItem value="helpfulCount-desc">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// Individual Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const [showFullComment, setShowFullComment] = useState(false);
  const maxLength = 300;
  const shouldTruncate = review.comment && review.comment.length > maxLength;

  const displayComment =
    shouldTruncate && !showFullComment
      ? review.comment!.substring(0, maxLength) + "..."
      : review.comment;

  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
              {review.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{review.email.split("@")[0]}</p>
              <p className="text-xs text-muted-foreground">{reviewDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            {review.verifiedPurchase && (
              <Badge variant="secondary" className="text-xs">
                ✓ Verified Purchase
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-lg">{review.title}</h4>
      )}

      {/* Comment */}
      {review.comment && (
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground whitespace-pre-wrap">
            {displayComment}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="text-primary text-sm font-medium hover:underline mt-1"
            >
              {showFullComment ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-md border bg-muted overflow-hidden"
            >
              <Image
                src={"http://localhost:3000/uploads/reviews/" + image}
                alt=""
              />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Counter */}
      {review.helpfulCount > 0 && (
        <div className="text-sm text-muted-foreground">
          {review.helpfulCount}{" "}
          {review.helpfulCount === 1 ? "person" : "people"} found this helpful
        </div>
      )}
    </div>
  );
}
