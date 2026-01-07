'use client';

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductVariantSection } from "@/components/ProductVariantSection";
import { ProductDetail, ProductVariant } from "@/types/product";

interface ProductEssentialsProps {
    product: ProductDetail;
    setSelectedVariant: (variant: ProductVariant | null) => void;
}

export const ProductEssentials = ({ product, setSelectedVariant }: ProductEssentialsProps) => {
    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#FF4F00] uppercase tracking-wide cursor-pointer hover:underline">
                            {product.cate.name}
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                        {product.name}
                    </h1>
                </div>

                <div className="flex items-center gap-4 text-sm border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? "fill-current" : "text-slate-200 fill-slate-200"}`} />
                            ))}
                        </div>
                        <span className="font-semibold text-slate-900">{product.averageRating?.toFixed(1)}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="text-slate-500">
                        <span className="font-semibold text-slate-900">{product.totalReviews}</span> Đánh giá
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="text-slate-500">
                        <span className="font-semibold text-slate-900">{product.totalSold}</span> Đã bán
                    </div>
                </div>
            </div>

            <div className="py-4">
                <ProductVariantSection product={product} onVariantChange={setSelectedVariant} />
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="hidden">
                    {/* Hiding duplicate specs here as we moved main specs to bottom */}
                </div>
            )}
        </div>
    );
};
