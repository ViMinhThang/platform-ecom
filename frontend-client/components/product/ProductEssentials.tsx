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
                <div className="flex items-center gap-2">
                    <Badge className="bg-black text-white rounded-none border-none px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase">
                        {product.cate.name}
                    </Badge>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">CERTIFIED_COMPONENT</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight uppercase">
                    {product.name}
                </h1>

                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <div className="flex items-center gap-2 text-black">
                        <span className="text-sm">
                            {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <Star className="w-3.5 h-3.5 fill-black text-black" />
                    </div>
                    <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-black">
                            {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                                .format(product.totalReviews || 0)}{" "}
                        </span>
                        <span>ĐÁNH GIÁ</span>
                    </div>
                    <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-black">
                            {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                                .format(product.totalSold || 0)}
                        </span>
                        <span>ĐÃ BÁN</span>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t-2 border-dashed border-black/10">
                <ProductVariantSection product={product} onVariantChange={setSelectedVariant} />
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="pt-8 border-t-2 border-black">
                    <h3 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-zinc-400">THÔNG SỐ CƠ BẢN // BASIC_SPECS</h3>
                    <dl className="grid grid-cols-2 gap-4">
                        {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <dt className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {key.replace(/_/g, " ")}
                                </dt>
                                <dd className="font-mono text-xs font-bold text-black uppercase">{String(value)}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </div>
    );
};
