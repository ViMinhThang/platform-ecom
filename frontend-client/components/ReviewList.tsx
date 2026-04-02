"use client";

import { useState } from "react";
import { useGetProductReviewsQuery } from "@/lib/store/api/clientApi";
import type { Review } from "@/types/review";
import { Star } from "lucide-react";
import { StarRating } from "./ui/StarRating";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RichTextPreview } from "./RichTextPreview";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-surface-container animate-pulse rounded-3xl" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
  const colors = ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500"];
  const bgColor = colors[reviewerName.length % colors.length];

  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-foreground/5 flex flex-col justify-between hover:shadow-md transition-shadow duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-1 text-[#ab2d00]">
           {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-current" : "text-foreground/10"}`} />
           ))}
        </div>
        
        <div className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed italic">
           "{review.comment?.replace(/<[^>]*>?/gm, '') || ""}"
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-foreground/5">
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 ${bgColor} text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase`}>
              {reviewerName.substring(0, 2)}
           </div>
           <div>
              <h4 className="text-sm font-bold text-foreground">{reviewerName}</h4>
              <p className="text-[10px] font-bold text-[#ab2d00] uppercase tracking-wide">Người mua đã xác minh</p>
           </div>
        </div>
      </div>
    </div>
  );
}
