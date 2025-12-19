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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 border-t pt-12">
            <div className="lg:col-span-1 border-t-2 border-primary pt-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-4">
                    Người <span className="text-primary italic">bán</span>
                </h2>
                <SellerInfoCard
                    sellerId={product.userId || 0}
                    totalSold={product.totalSold}
                    createdAt={product.createdAt}
                />
            </div>

            <div className="lg:col-span-3 border-t-2 border-primary pt-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-6">
                    Đánh giá <span className="text-primary italic">khách hàng</span>
                </h2>
                <div className="bg-card border p-4 sm:p-6">
                    <ReviewStats productId={product.id} />
                    <div className="mt-8">
                        <ReviewList productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};
