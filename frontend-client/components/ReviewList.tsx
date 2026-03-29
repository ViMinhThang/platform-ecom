"use client";

import { useState } from "react";
import { useGetProductReviewsQuery } from "@/lib/store/api/clientApi";
import type { Review } from "@/types/review";
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
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: reviewsData, isLoading: loading, error } = useGetProductReviewsQuery({
    productId,
    pageNumber: page,
    pageSize: 10
  });

  const reviews = reviewsData?.content || [];
  const pagination = {
    totalElements: reviewsData?.totalElements || 0,
    totalPages: reviewsData?.totalPages || 0,
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDir] = value.split("-");
    setSortBy(newSortBy);
    setSortDir(newSortDir as "asc" | "desc");
    setPage(0);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 border-t border-border/10 animate-pulse">
            <div className="md:col-span-4 space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
            <div className="md:col-span-8 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-20 bg-muted rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-destructive font-header italic">
        <p>{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="flex justify-between items-end pb-12">
        <div className="flex items-center gap-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
            {pagination.totalElements} ĐÁNH GIÁ
          </h3>
        </div>
        <Select value={`${sortBy}-${sortDir}`} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] border-none bg-transparent text-[10px] font-bold uppercase tracking-widest text-foreground/60 shadow-none focus:ring-0">
            <SelectValue placeholder="SẮP XẾP THEO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">MỚI NHẤT</SelectItem>
            <SelectItem value="createdAt-asc">CŨ NHẤT</SelectItem>
            <SelectItem value="rating-desc">ĐÁNH GIÁ CAO</SelectItem>
            <SelectItem value="rating-asc">ĐÁNH GIÁ THẤP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!loading && reviews.length === 0 ? (
        <div className="text-center py-32 border-t border-dashed border-border/20">
          <p className="font-header italic text-foreground/30 text-lg">Chưa có đánh giá nào được ghi nhận.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-border/10">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-12 pt-24 border-t border-border/10">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-primary disabled:opacity-20 transition-all"
              >
                TRANG TRƯỚC
              </button>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 font-labels">
                {page + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                disabled={page >= pagination.totalPages - 1}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-primary disabled:opacity-20 transition-all font-labels"
              >
                TRANG TIẾP
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const reviewerName = review.email.split("@")[0].charAt(0).toUpperCase() + review.email.split("@")[0].slice(1);
  const statusLabel = "Chuyên Gia Lưu Trữ";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 border-t border-border/10 first:border-0">
      {/* LEFT COLUMN: REVIEWER IDENTITY */}
      <div className="md:col-span-4 space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-sm border border-foreground/5 shadow-sm flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-foreground/20" />
          </div>
          <div className="space-y-1">
            <h4 className="font-labels text-lg font-bold tracking-tight text-foreground/90 uppercase">
              {reviewerName}
            </h4>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 font-labels">
              KHÁCH HÀNG
            </p>
          </div>
        </div>
        <div className="pt-1">
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>

      {/* RIGHT COLUMN: THE CRITIQUE */}
      <div className="md:col-span-8 space-y-6">
        <div className="space-y-4">
          <div className="text-[16px] leading-relaxed text-foreground/80 font-labels font-medium">
            {review.comment && (
              <RichTextPreview content={review.comment} className="p-0 bg-transparent rounded-none" />
            )}
          </div>
        </div>

        {/* HELPFUL COUNTER */}
        {review.helpfulCount > 0 && (
          <div className="pt-4 text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/20 italic font-labels">
            {review.helpfulCount} người thấy hữu ích
          </div>
        )}
      </div>
    </div>
  );
}
