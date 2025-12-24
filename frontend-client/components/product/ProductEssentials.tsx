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
        <div className="space-y-12">
            <div>
                <Badge className="mb-4 rounded-none bg-zinc-100/80 text-zinc-900 hover:bg-zinc-200 border-none px-4 py-1.5 text-[10px] font-semibold tracking-widest uppercase font-header">
                    {product.cate.name}
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight leading-[1.2] font-header text-zinc-900">{product.name}</h1>

                <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <span className="text-foreground text-lg font-semibold font-header">
                            {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <Star className="w-4 h-4 fill-primary text-primary" />
                    </div>
                    <div className="h-4 w-px bg-border/60" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-foreground font-semibold">
                            {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                                .format(product.totalReviews || 0)}{" "}
                        </span>
                        <span>đánh giá</span>
                    </div>
                    <div className="h-4 w-px bg-border/60" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-foreground font-semibold">
                            {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                                .format(product.totalSold || 0)}
                        </span>
                        <span>đã bán</span>
                    </div>
                </div>
            </div>

            <ProductVariantSection product={product} onVariantChange={setSelectedVariant} />

            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-t pt-12">
                    <h3 className="text-base font-bold mb-8 uppercase tracking-widest text-zinc-400 font-header">Thông số kỹ thuật</h3>
                    <dl className="space-y-6">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-end border-b border-zinc-100 pb-3">
                                <dt className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {key.replace(/_/g, " ")}
                                </dt>
                                <dd className="font-semibold text-lg tracking-tight text-zinc-800">{String(value)}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </div>
    );
};
