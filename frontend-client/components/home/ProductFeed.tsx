"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getPersonalizedFeed } from "@/lib/services/recommendation-service";
import { useSession } from "next-auth/react";
import { ProductRecommendation } from "@/types/recommendation";

export function ProductFeed() {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { products, loading } = useAppSelector((state) => state.products);
    const [activeTab, setActiveTab] = useState("daily");
    const [personalizedProducts, setPersonalizedProducts] = useState<ProductRecommendation[]>([]);
    const [recLoading, setRecLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'personalized') {
            fetchPersonalized();
        } else if (activeTab !== 'personalized') {
            dispatch(fetchProducts({
                sortBy: activeTab === 'top' ? 'price' : 'createdAt',
                sortOrder: activeTab === 'top' ? 'asc' : 'desc',
                perPage: 24
            }));
        }
    }, [activeTab, dispatch, session]);

    const fetchPersonalized = async () => {
        setRecLoading(true);
        try {
            const data = await getPersonalizedFeed(session?.user?.id ? Number(session.user.id) : 1, 24); // Fallback to 1 or any logic if no session, or just undefined
            setPersonalizedProducts(data || []);
        } catch (error) {
            console.error(error);
            setPersonalizedProducts([]);
        }
        setRecLoading(false);
    };

    return (
        <div className="container mx-auto px-4 mb-20">
            {/* Industrial Tab Header */}
            <div className="sticky top-[100px] z-40 bg-background/80 backdrop-blur-md mb-8">
                <div className="flex border border-border rounded-sm overflow-hidden shadow-sm">
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`flex-1 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'daily'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary'
                            }`}
                    >
                        Gợi ý hàng ngày
                    </button>
                    <button
                        onClick={() => setActiveTab('personalized')}
                        className={`flex-1 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-l border-border ${activeTab === 'personalized'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary'
                            }`}
                    >
                        Dành riêng cho bạn
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[400px]">
                {(loading || recLoading) && (activeTab === 'personalized' ? personalizedProducts.length === 0 : products.length === 0) ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse border border-black/5" />
                    ))
                ) : (
                    activeTab === 'personalized' ? (
                        personalizedProducts.map((p) => (
                            <div key={p.product_id} className="h-full border border-black/10 hover:border-black transition-all bg-white">
                                <ProductCard
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
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="h-full border border-black/10 hover:border-black transition-all bg-white">
                                <ProductCard
                                    id={product.id.toString()}
                                    slug={product.slug}
                                    name={product.name}
                                    price={product.minPrice}
                                    image={product.imageUrl || ''}
                                    category={product.category.name}
                                    soldCount={124}
                                    firstVariant={product.firstVariant}
                                    sourceContext="daily_feed"
                                />
                            </div>
                        ))
                    )
                )}
            </div>

            <div className="flex justify-center mt-12">
                <Button className="px-12 py-6 rounded-sm border border-primary/20 bg-background text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-[0.2em] text-[10px] transition-all shadow-sm">
                    Xem thêm sản phẩm
                </Button>
            </div>
        </div>
    );
}
