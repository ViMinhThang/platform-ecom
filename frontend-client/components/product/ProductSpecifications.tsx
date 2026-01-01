'use client';

import { ProductDetail } from "@/types/product";

interface ProductSpecificationsProps {
    product: ProductDetail;
}

export const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
    const specs = product.specifications;

    if (!specs || Object.keys(specs).length === 0) {
        return null;
    }

    return (
        <section className="p-0">
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-[0.2em] text-muted-foreground/80 border-b pb-6">
                Thông số kỹ thuật
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                {Object.entries(specs).map(([key, value], index) => (
                    <div
                        key={key}
                        className={`flex justify-between py-5 border-b border-slate-100 items-baseline ${index % 2 === 0 ? 'md:pr-6' : 'md:pl-6'
                            }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 shrink-0">
                            {key}
                        </span>
                        <span className="text-sm font-bold text-slate-900 text-right ml-4">
                            {String(value)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};
