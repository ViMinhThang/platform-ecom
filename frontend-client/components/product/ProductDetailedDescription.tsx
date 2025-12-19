'use client';

import { RichTextPreview } from "@/components/RichTextPreview";
import { ProductDetail } from "@/types/product";

interface ProductDetailedDescriptionProps {
    product: ProductDetail;
}

export const ProductDetailedDescription = ({ product }: ProductDetailedDescriptionProps) => {
    return (
        <section className="bg-card border-y p-6 sm:p-8">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-widest text-muted-foreground/80">
                <span className="w-1 h-6 bg-primary" />
                Mô tả sản phẩm
            </h2>
            <RichTextPreview
                content={product.description || "<p className='text-muted-foreground italic text-sm'>Chưa có mô tả cho sản phẩm này.</p>"}
            />
        </section>
    );
};
