'use client';

import { ProductDetail } from "@/types/product";

interface ProductSpecificationsProps {
    product: ProductDetail;
}

export const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
    const specs = product.specifications || {};

    if (Object.keys(specs).length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-0 divide-y divide-border border-y border-border">
                {Object.entries(specs).map(([key, value]) => (
                    <div
                        key={key}
                        className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] py-4 font-header"
                    >
                        <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                            {key.replace(/_/g, " ")}
                        </div>
                        <div className="text-foreground font-medium text-sm">
                            {String(value)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
