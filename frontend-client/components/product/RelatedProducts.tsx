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
            
            // Track impressions
            data.forEach(p => {
                trackEvent({
                    eventType: EventType.PRODUCT_VIEW, // Or a specific RECOMMENDATION_IMPRESSION event
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

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-sm" />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => (
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
                        id: 0, // Placeholder
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
            ))}
        </div>
    );
};
