'use client';

import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { ProductDetail } from "@/types/product";

interface ProductFeedbackProps {
    product: ProductDetail;
}

export const ProductFeedback = ({ product }: ProductFeedbackProps) => {
    return (
        <div className="space-y-4 w-full">
            {/* SIMPLIFIED REVIEW HEADER */}
            <div className="flex items-end justify-between pb-12 border-b border-border/10 mb-16">
                <div className="space-y-4">
                    <h2 className="font-labels text-3xl font-bold tracking-tight text-foreground/90 uppercase">Đánh giá sản phẩm</h2>
                </div>
                <button className="text-[11px] font-bold uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-2 hover:text-primary hover:border-primary transition-all font-labels">
                    Gửi đánh giá
                </button>
            </div>

            {/* LIST SECTION */}
            <div className="w-full">
                <ReviewList productId={product.id} />
            </div>
        </div>
    );
};
