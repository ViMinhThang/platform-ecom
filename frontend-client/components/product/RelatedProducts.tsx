'use client';

import { useEffect, useState } from 'react';
import { getSimilarProducts } from '@/lib/services/recommendation-service';
import { ProductRecommendation } from '@/types/recommendation';
import { ProductCard } from '@/components/ProductCard';
import { useAnalytics } from '@/hooks/useAnalytics';

interface RelatedProductsProps {
    productId: number;
}

export const RelatedProducts = ({ productId }: RelatedProductsProps) => {
    const [products, setProducts] = useState<ProductRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const { trackEvent, EventType } = useAnalytics();

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            const data = await getSimilarProducts(productId, 6);
            setProducts(data);
            setLoading(false);
            
            data.forEach(p => {
                trackEvent({
                    eventType: EventType.PRODUCT_VIEW,
                    productId: p.product_id,
                    sourceContext: 'related_products',
                    metadata: { recommendationScore: p.score, reason: p.reason }
                });
            });
        };

        if (productId) {
            fetchRelated();
        }
    }, [productId]);

    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <div className="bg-[#F5F3F4] p-8 md:p-16 rounded-sm border border-foreground/5 overflow-hidden">
            <div className="flex items-center gap-4 mb-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">BỘ SƯU TẬP TƯƠNG TỰ</span>
                <div className="h-px bg-foreground/10 flex-1" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground font-labels">CÁC VẬT PHẨM LIÊN QUAN</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4 animate-pulse">
                            <div className="aspect-[4/5] bg-secondary/50 rounded-sm" />
                            <div className="h-2 bg-secondary/50 w-1/4" />
                            <div className="h-4 bg-secondary/50 w-3/4" />
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            id={product.product_id.toString()}
                            slug={product.slug}
                            name={product.product_name}
                            price={product.original_price}
                            image={product.image_url}
                            category={product.category_name}
                            sourceContext="related_products"
                            firstVariant={{
                                id: 0,
                                sku: '',
                                price: product.original_price,
                                salePrice: product.sale_price,
                                discountPercent: product.discount_percent || 0,
                                stock: product.stock_quantity,
                                imageUrl: product.image_url,
                                isActive: true,
                                totalSold: 0,
                                hidden: false,
                                optionValues: [],
                                createdAt: '',
                                updatedAt: ''
                            } as any}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
