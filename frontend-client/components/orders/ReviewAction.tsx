"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { checkUserReview } from "@/lib/services/review-service";
import { Review } from "@/types/review";

interface ReviewActionProps {
    productId: number;
    orderId: number;
    status: string;
    onReview: (productId: number, orderId: number) => void;
    refreshTrigger?: number;
}

export function ReviewAction({ productId, orderId, status, onReview, refreshTrigger = 0 }: ReviewActionProps) {
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "DELIVERED") {
            const fetchStatus = async () => {
                setLoading(true);
                try {
                    const data = await checkUserReview(productId, orderId);
                    setReview(data);
                } catch (error) {
                    console.error("Failed to check review status", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStatus();
        }
    }, [productId, orderId, status, refreshTrigger]);

    if (status !== "DELIVERED") return null;
    if (loading) return <div className="h-8 w-20 animate-pulse bg-muted rounded" />;

    if (review) {
        return (
            <div className="mt-2 text-right">
                <div className="flex items-center gap-1 justify-end">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={"star-" + i}
                            className={`size-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300'}`}
                        />
                    ))}
                </div>
                {review.comment && (
                    <p className="text-[10px] text-muted-foreground italic mt-1 line-clamp-1 max-w-[150px]">
                        "{review.comment}"
                    </p>
                )}
            </div>
        );
    }

    return (
        <Button variant="outline" size="sm" className="mt-2" onClick={() => onReview(productId, orderId)}>
            Đánh giá
        </Button>
    );
}
