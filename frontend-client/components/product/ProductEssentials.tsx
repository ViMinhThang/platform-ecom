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
        <div className="space-y-8">
            <div>
                <Badge className="mb-3 rounded-none bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-none px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                    {product.cate.name}
                </Badge>
                <h1 className="text-3xl font-extrabold tracking-tight uppercase">{product.name}</h1>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1">
                        <span className="text-foreground">
                            {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div>
                        {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                            .format(product.totalReviews || 0)
                            .toLowerCase()}{" "}
                        đánh giá
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div>
                        {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                            .format(product.totalSold || 0)
                            .toLowerCase()}+ đã bán
                    </div>
                </div>
            </div>

            <ProductVariantSection product={product} onVariantChange={setSelectedVariant} />

            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-t pt-8">
                    <h3 className="text-sm font-black mb-6 uppercase tracking-[0.2em] text-muted-foreground">Thông số kỹ thuật</h3>
                    <dl className="space-y-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-end border-b border-zinc-100 pb-2">
                                <dt className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    {key.replace(/_/g, " ")}
                                </dt>
                                <dd className="font-bold text-sm tracking-tight">{String(value)}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </div>
    );
};
