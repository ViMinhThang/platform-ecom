"use client";

import { useState, useEffect } from "react";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getPersonalizedFeed } from "@/lib/services/recommendation-service";
import { useSession } from "next-auth/react";
import { ProductRecommendation } from "@/types/recommendation";
import Link from "next/link";

import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProductFeed() {
    const { data: session } = useSession();
    const [activeTab] = useState("daily");
    const [personalizedProducts] = useState<ProductRecommendation[]>([]);
    const [recLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        perPage: 4 // Showing a single row as per image
    });

    const products = productsData?.content || [];

    return (
        <div className="bg-background w-full py-16">
            <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h2 className="font-header text-xl md:text-2xl font-bold text-foreground">Gợi ý cho bạn</h2>
                        <p className="text-[13px] font-medium text-foreground/40 italic">Dựa trên sở thích của bạn</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-9 w-9 rounded-full border border-foreground/5 bg-surface-container/50 flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm">
                            <ArrowLeft className="h-4 w-4 text-foreground/40" />
                        </button>
                        <button className="h-9 w-9 rounded-full border border-foreground/5 bg-surface-container/50 flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm">
                            <ArrowRight className="h-4 w-4 text-foreground/40" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {!isMounted || (productsLoading || recLoading) && (activeTab === 'personalized' ? personalizedProducts.length === 0 : products.length === 0) ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-square bg-surface-container rounded-lg" />
                                <div className="h-2 bg-surface-container w-1/4 rounded" />
                                <div className="h-4 bg-surface-container w-3/4 rounded" />
                                <div className="h-4 bg-surface-container w-1/2 rounded" />
                            </div>
                        ))
                    ) : (
                        activeTab === 'personalized' ? (
                            personalizedProducts.map((p) => (
                                <ProductCard
                                    key={p.product_id}
                                    id={p.product_id.toString()}
                                    slug={p.slug}
                                    name={p.product_name}
                                    price={p.original_price}
                                    image={p.image_url}
                                    category={p.category_name}
                                    sourceContext="personalized_feed"
                                    firstVariant={{
                                        price: p.original_price,
                                        salePrice: p.sale_price,
                                        discountPercent: p.discount_percent || 0,
                                        stock: p.stock_quantity,
                                        imageUrl: p.image_url,
                                    } as any}
                                />
                            ))
                        ) : (
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id.toString()}
                                    slug={product.slug}
                                    name={product.name}
                                    price={product.minPrice}
                                    image={product.imageUrl || ''}
                                    category={product.category.name}
                                    firstVariant={product.firstVariant}
                                    sourceContext="daily_feed"
                                />
                            ))
                        )
                    )}
                </div>

                <div className="flex justify-center mt-16">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/products">
                            Xem tất cả sản phẩm
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
