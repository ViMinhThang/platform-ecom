"use client";

// Client Component - Paginated Review List

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProductReviews, resetReviews } from "@/lib/store/slices/reviewSlice";
import { GetReviewsParams } from "@/lib/services/review-service";
import type { Review } from "@/types/review";
import { StarRating } from "./ui/StarRating";
import { ReviewForm } from "./ReviewForm";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { imageUrl } from "@/lib/utils/imageUrl";
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
  const dispatch = useAppDispatch();
  const { reviews, loading, error, pagination } = useAppSelector((state) => state.reviews);

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    return () => {
      dispatch(resetReviews());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    const params: GetReviewsParams = {
      pageNumber: page,
      pageSize: 10,
      sortBy,
      sortDir,
    };

    dispatch(fetchProductReviews({ productId, params }));
  }, [dispatch, productId, page, sortBy, sortDir]);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDir] = value.split("-");
    setSortBy(newSortBy);
    setSortDir(newSortDir as "asc" | "desc");
    setPage(0); // Reset to first page
  };

  if (loading && reviews.length === 0) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">
            {pagination.totalElements} đánh giá
          </h3>
          <ReviewForm productId={productId} />
        </div>
        <Select value={`${sortBy}-${sortDir}`} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
            <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
            <SelectItem value="rating-desc">Đánh giá cao nhất</SelectItem>
            <SelectItem value="rating-asc">Đánh giá thấp nhất</SelectItem>
            <SelectItem value="helpfulCount-desc">Hữu ích nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!loading && reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Trước
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Trang {page + 1} trên {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                disabled={page >= pagination.totalPages - 1}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [showFullComment, setShowFullComment] = useState(false);
  const maxLength = 300;
  const shouldTruncate = review.comment && review.comment.length > maxLength;

  const displayComment =
    shouldTruncate && !showFullComment
      ? review.comment!.substring(0, maxLength) + "..."
      : review.comment;

  const reviewDate = new Date(review.createdAt).toLocaleDateString("vi-VN", {
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
                ✓ Đã mua hàng
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
              {showFullComment ? "Thu gọn" : "Xem thêm"}
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
                width={100}
                height={100}
                src={imageUrl.review(image)}
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
          người thấy đánh giá này hữu ích
        </div>
      )}
    </div>
  );
}
