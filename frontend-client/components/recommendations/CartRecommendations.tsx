'use client';

import { useEffect, useState } from 'react';
import { getSimilarProducts } from '@/lib/services/recommendation-service';
import { ProductRecommendation } from '@/types/recommendation';
import { ProductCard } from '@/components/ProductCard';
import { useGetCartQuery } from '@/lib/store/api/clientApi';

export const CartRecommendations = () => {
    const { data: cart } = useGetCartQuery();
    const items = cart?.items || [];
    const [products, setProducts] = useState<ProductRecommendation[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (items.length === 0) return;
            
            setLoading(true);
            const productId = items[0].productId;
            const data = await getSimilarProducts(productId, 4);
            setProducts(data);
            setLoading(false);
        };

        fetchRecommendations();
    }, [items]);

    if (items.length === 0 || (products.length === 0 && !loading)) {
        return null;
    }

    return (
        <div className="mt-20 bg-[#F5F3F4] p-8 md:p-12 rounded-sm border border-foreground/5 overflow-hidden">
            <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">VẬT PHẨM BỔ SUNG</span>
                <div className="h-px bg-foreground/10 flex-1" />
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground font-labels">BẠN CÓ THỂ MUỐN MUA KÈM</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="aspect-[4/5] bg-secondary/50 rounded-sm" />
                            <div className="h-2 bg-secondary/50 w-1/4" />
                            <div className="h-4 bg-secondary/50 w-3/4" />
                        </div>
                    ))
                ) : (
                    products.map((p) => (
                        <ProductCard
                            key={p.product_id}
                            id={p.product_id.toString()}
                            slug={p.slug}
                            name={p.product_name}
                            price={p.original_price}
                            image={p.image_url}
                            category={p.category_name}
                            sourceContext="cart_recommendations"
                            firstVariant={{
                                price: p.original_price,
                                salePrice: p.sale_price,
                                discountPercent: p.discount_percent || 0,
                                stock: p.stock_quantity,
                                imageUrl: p.image_url,
                            } as any}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
