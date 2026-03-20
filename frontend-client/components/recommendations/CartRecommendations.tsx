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
            // Get similar products for the first item in cart as a proxy for "Frequently bought together"
            // In a real app, we'd have a specific endpoint for this
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
        <div className="mt-12 border-t-2 border-black pt-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6">Bạn có thể muốn mua kèm</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse border border-black/5" />
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
