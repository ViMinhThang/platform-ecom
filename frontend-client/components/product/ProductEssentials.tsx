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
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest cursor-pointer hover:underline">
                            {product.cate.name}
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                        {product.name}
                    </h1>
                </div>

                <div className="flex items-center gap-4 text-[10px] border-b border-border pb-4 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-primary">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.round(product.averageRating || 0) ? "fill-current" : "text-muted border-muted fill-muted"}`} />
                            ))}
                        </div>
                        <span className="text-foreground">{product.averageRating?.toFixed(1)}</span>
                    </div>
                    <div className="w-px h-3 bg-border"></div>
                    <div className="text-muted-foreground">
                        <span className="text-foreground">{product.totalReviews}</span> Đánh giá
                    </div>
                    <div className="w-px h-3 bg-border"></div>
                    <div className="text-muted-foreground">
                        <span className="text-foreground">{product.totalSold}</span> Đã bán
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
