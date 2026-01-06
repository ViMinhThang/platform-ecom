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
        <section className="space-y-8">
            <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-[0.2em] text-black">
                <span className="bg-black text-white px-2 py-0.5 text-xs">01</span>
                THÔNG SỐ KỸ THUẬT // TECH_SPECS
            </h2>

            <div className="grid grid-cols-1 gap-px bg-black border-2 border-black">
                {Object.entries(specs).map(([key, value]) => (
                    <div
                        key={key}
                        className="grid grid-cols-[1fr_2fr] bg-white divide-x-2 divide-black"
                    >
                        <div className="p-4 bg-zinc-50 flex items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {key.replace(/_/g, " ")}
                            </span>
                        </div>
                        <div className="p-4 flex items-center bg-white">
                            <span className="text-xs font-mono font-bold text-black uppercase">
                                {String(value)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
