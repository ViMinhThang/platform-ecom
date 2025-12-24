'use client';

import { RichTextPreview } from "@/components/RichTextPreview";
import { ProductDetail } from "@/types/product";

interface ProductDetailedDescriptionProps {
    product: ProductDetail;
}

export const ProductDetailedDescription = ({ product }: ProductDetailedDescriptionProps) => {
    return (
        <section className="p-0">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-muted-foreground/80 border-b pb-6">
                Mô tả sản phẩm
            </h2>
            <div className="prose prose-lg max-w-none">
                <RichTextPreview
                    content={product.description || "<p className='text-muted-foreground italic text-lg'>Chưa có mô tả cho sản phẩm này.</p>"}
                />
            </div>
        </section>
    );
};
