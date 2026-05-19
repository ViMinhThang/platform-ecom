'use client';

import { ProductVariantSection } from "@/components/ProductVariantSection";
import { ProductDetail, ProductVariant } from "@/types/product";

interface ProductEssentialsProps {
    product: ProductDetail;
    setSelectedVariant: (variant: ProductVariant | null) => void;
}

export const ProductEssentials = ({ product, setSelectedVariant }: ProductEssentialsProps) => {
    return (
        <div className="space-y-12">
            <div className="py-4">
                <ProductVariantSection product={product} onVariantChange={setSelectedVariant} />
            </div>

            <div className="space-y-6 pt-8 border-t border-border/10">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Giao hàng</span>
                        <p className="text-xs font-bold">Vận chuyển quốc tế bởi Hội thương nhân ACME</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Cam kết</span>
                        <p className="text-xs font-medium">Xác thực nguồn gốc & Bảo hiểm vật phẩm lưu trữ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
