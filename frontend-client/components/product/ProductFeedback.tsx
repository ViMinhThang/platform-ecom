'use client';

import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { SellerInfoCard } from "@/components/product/SellerInfoCard";
import { ProductDetail } from "@/types/product";

interface ProductFeedbackProps {
    product: ProductDetail;
}

export const ProductFeedback = ({ product }: ProductFeedbackProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-border divide-x-0 lg:divide-x divide-border">
            <div className="lg:col-span-4 p-8">
                <h2 className="text-[11px] font-bold flex items-center gap-3 uppercase tracking-[0.2em] text-foreground mb-10">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 text-[9px]">03</span>
                    NGƯỜI BÁN
                </h2>
                <SellerInfoCard
                    sellerId={product.userId || 0}
                    totalSold={product.totalSold}
                    createdAt={product.createdAt}
                />
            </div>

            <div className="lg:col-span-8 p-8 border-t lg:border-t-0 border-border">
                <h2 className="text-[11px] font-bold flex items-center gap-3 uppercase tracking-[0.2em] text-foreground mb-10">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 text-[9px]">04</span>
                    ĐÁNH GIÁ SẢN PHẨM
                </h2>
                <div className="bg-muted/10 border border-border p-6 md:p-8 rounded-sm shadow-inner">
                    <ReviewStats productId={product.id} />
                    <div className="mt-10 pt-10 border-t border-dashed border-border/50">
                        <ReviewList productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};
