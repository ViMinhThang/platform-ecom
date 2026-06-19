"use client";

import { useState } from "react";
import { useGetProductReviewsQuery } from "@/lib/store/api/clientApi";
import type { Review } from "@/types/review";
import { Star } from "lucide-react";

const REVIEW_CARD_COLORS = ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500"];

interface ReviewListProps {
  productId: number;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [page, setPage] = useState(0);

  const { data: reviewsData, isLoading: loading, error } = useGetProductReviewsQuery({
    productId,
    pageNumber: page,
    pageSize: 6
  });

  const reviews = reviewsData?.content || [];
  const pagination = {
    totalElements: reviewsData?.totalElements || 0,
    totalPages: reviewsData?.totalPages || 0,
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={"skeleton-" + i} className="h-40 animate-pulse rounded-sm border border-foreground/10 bg-white" />
        ))}
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="space-y-16">
      {!loading && reviews.length === 0 ? (
        <div className="text-center py-20 bg-surface-container rounded-3xl border-2 border-dashed border-foreground/5">
          <p className="font-header italic text-foreground/30 text-lg font-medium">Chưa có đánh giá nào được chia sẻ.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-12">
            <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-[11px] font-bold uppercase tracking-widest hover:text-primary disabled:opacity-20 transition-all"
            >
                Trang Trước
            </button>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/30">
                {page + 1} / {pagination.totalPages}
            </span>
            <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                disabled={page >= pagination.totalPages - 1}
                className="text-[11px] font-bold uppercase tracking-widest hover:text-primary disabled:opacity-20 transition-all"
            >
                Trang Tiếp
            </button>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const reviewerName = review.email.split("@")[0].charAt(0).toUpperCase() + review.email.split("@")[0].slice(1);
  const bgColor = REVIEW_CARD_COLORS[reviewerName.length % REVIEW_CARD_COLORS.length];

  return (
    <div className="flex flex-col justify-between rounded-sm border border-foreground/10 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="space-y-6">
        <div className="flex items-center gap-1 text-[#ab2d00]">
           {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`size-3 ${s <= review.rating ? "fill-current" : "text-foreground/10"}`} />
           ))}
        </div>
        
        <div className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed italic">
           &ldquo;{review.comment?.replace(/<[^>]*>?/gm, '') || ""}&rdquo;
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-foreground/5">
        <div className="flex items-center gap-4">
           <div className={`size-10 ${bgColor} text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase`}>
              {reviewerName.substring(0, 2)}
           </div>
           <div>
              <h4 className="text-sm font-semibold text-foreground">{reviewerName}</h4>
              <p className="text-[10px] font-bold text-[#ab2d00] uppercase tracking-wide">Người mua đã xác minh</p>
           </div>
        </div>
      </div>
    </div>
  );
}
