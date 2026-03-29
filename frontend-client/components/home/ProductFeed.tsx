"use client";

import { useState, useEffect } from "react";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getPersonalizedFeed } from "@/lib/services/recommendation-service";
import { useSession } from "next-auth/react";
import { ProductRecommendation } from "@/types/recommendation";

export function ProductFeed() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("daily");
    const [personalizedProducts, setPersonalizedProducts] = useState<ProductRecommendation[]>([]);
    const [recLoading, setRecLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        perPage: 12
    });

    const products = productsData?.content || [];

    const fetchPersonalized = async () => {
        setRecLoading(true);
        try {
            const data = await getPersonalizedFeed(session?.user?.id ? Number(session.user.id) : 1, 12);
            setPersonalizedProducts(data || []);
        } catch (error) {
            console.error(error);
            setPersonalizedProducts([]);
        }
        setRecLoading(false);
    };

    return (
        <div className="bg-[#F5F3F4] w-full py-32">
            <section className="max-w-[1600px] mx-auto">
                {/* Editorial Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <h2 className="font-labels font-bold text-4xl text-foreground/90 tracking-tight">Sản phẩm đề xuất cho bạn</h2>
                        <div className="flex items-center gap-10 border-b border-border/5 pb-4">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all relative pb-4 ${activeTab === 'daily'
                                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary'
                                    : 'text-foreground/30 hover:text-foreground'
                                    }`}
                            >
                                Gợi ý hàng ngày
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('personalized');
                                    if (personalizedProducts.length === 0) fetchPersonalized();
                                }}
                                className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all relative pb-4 ${activeTab === 'personalized'
                                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary'
                                    : 'text-foreground/30 hover:text-foreground'
                                    }`}
                            >
                                Dành riêng cho bạn
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {!isMounted || (productsLoading || recLoading) && (activeTab === 'personalized' ? personalizedProducts.length === 0 : products.length === 0) ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-square bg-secondary/50 rounded-sm" />
                                <div className="h-2 bg-secondary/50 w-1/4" />
                                <div className="h-4 bg-secondary/50 w-3/4" />
                                <div className="h-4 bg-secondary/50 w-1/2" />
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

                <div className="flex justify-center mt-24">
                    <Button className="group bg-transparent text-primary hover:bg-primary hover:text-white border border-primary/20 px-12 py-6 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                        Xem tất cả sản phẩm
                    </Button>
                </div>
            </section>
        </div>
    );
}
