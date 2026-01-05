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
        <div className="grid grid-cols-1 lg:grid-cols-12 border-t-2 border-black divide-x-0 lg:divide-x-2 divide-black">
            <div className="lg:col-span-4 p-8 md:p-12">
                <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-[0.2em] text-black mb-10">
                    <span className="bg-black text-white px-2 py-0.5 text-xs">03</span>
                    NHÀ CUNG CẤP // VENDOR_INFO
                </h2>
                <SellerInfoCard
                    sellerId={product.userId || 0}
                    totalSold={product.totalSold}
                    createdAt={product.createdAt}
                />
            </div>

            <div className="lg:col-span-8 p-8 md:p-12 border-t-2 lg:border-t-0 border-black">
                <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-[0.2em] text-black mb-10">
                    <span className="bg-black text-white px-2 py-0.5 text-xs">04</span>
                    BÁO CÁO NGƯỜI DÙNG // FIELD_REPORTS
                </h2>
                <div className="bg-zinc-50 border-2 border-black p-6 md:p-10">
                    <ReviewStats productId={product.id} />
                    <div className="mt-10 pt-10 border-t-2 border-dashed border-black/10">
                        <ReviewList productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};
