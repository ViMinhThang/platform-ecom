"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { getPersonalizedFeed } from "@/lib/services/recommendation-service";
import { ProductRecommendation } from "@/types/recommendation";
import { ProductVariant } from "@/types/product";

type FeedTab = "daily" | "personalized";

export function ProductFeed() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<FeedTab>("daily");
    const [personalizedProducts, setPersonalizedProducts] = useState<ProductRecommendation[]>([]);
    const [recLoading, setRecLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [hasPersonalizedResult, setHasPersonalizedResult] = useState(false);

    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({
        sortBy: "createdAt",
        sortOrder: "desc",
        perPage: 8,
    });
    const products = productsData?.content || [];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const loadPersonalizedFeed = async () => {
            if (activeTab !== "personalized") {
                return;
            }

            const userId = Number(session?.user?.id);
            if (!userId || Number.isNaN(userId)) {
                setPersonalizedProducts([]);
                setHasPersonalizedResult(false);
                return;
            }

            setRecLoading(true);
            try {
                const data = await getPersonalizedFeed(userId, 8, 0);
                setPersonalizedProducts(data);
                setHasPersonalizedResult(data.length > 0);
            } catch {
                setPersonalizedProducts([]);
                setHasPersonalizedResult(false);
            } finally {
                setRecLoading(false);
            }
        };

        loadPersonalizedFeed();
    }, [activeTab, session?.user?.id]);

    const usePersonalizedResults =
        activeTab === "personalized" && hasPersonalizedResult && personalizedProducts.length > 0;
    const showFallbackNotice =
        activeTab === "personalized" && !recLoading && !usePersonalizedResults;

    const showSkeleton =
        !isMounted ||
        (activeTab === "daily" && productsLoading && products.length === 0) ||
        (activeTab === "personalized" &&
            recLoading &&
            personalizedProducts.length === 0 &&
            products.length === 0);

    return (
        <div className="bg-background w-full py-16">
            <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h2 className="font-header text-xl md:text-2xl font-bold text-foreground">
                            Recommendations
                        </h2>
                        <p className="text-[13px] font-medium text-foreground/40 italic">
                            Personalized when possible, with fresh arrivals as fallback.
                        </p>
                    </div>

                    <div className="inline-flex rounded-full border border-foreground/10 bg-surface-container/40 p-1">
                        <button
                            type="button"
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                activeTab === "daily"
                                    ? "bg-foreground text-background"
                                    : "text-foreground/60 hover:text-foreground"
                            }`}
                            onClick={() => setActiveTab("daily")}
                        >
                            Daily
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                activeTab === "personalized"
                                    ? "bg-foreground text-background"
                                    : "text-foreground/60 hover:text-foreground"
                            }`}
                            onClick={() => setActiveTab("personalized")}
                        >
                            Personalized
                        </button>
                    </div>
                </div>

                {showFallbackNotice && (
                    <p className="mb-6 text-xs text-foreground/50">
                        Personalized feed is unavailable right now. Showing daily recommendations.
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {showSkeleton
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="space-y-4 animate-pulse">
                                  <div className="aspect-square bg-surface-container rounded-lg" />
                                  <div className="h-2 bg-surface-container w-1/4 rounded" />
                                  <div className="h-4 bg-surface-container w-3/4 rounded" />
                                  <div className="h-4 bg-surface-container w-1/2 rounded" />
                              </div>
                          ))
                        : usePersonalizedResults
                          ? personalizedProducts.map((p) => (
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
                                    } as unknown as ProductVariant}
                                />
                            ))
                          : products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id.toString()}
                                    slug={product.slug}
                                    name={product.name}
                                    price={product.minPrice}
                                    image={product.imageUrl || ""}
                                    category={product.category.name}
                                    firstVariant={product.firstVariant}
                                    sourceContext="daily_feed"
                                />
                            ))}
                </div>

                <div className="flex justify-center mt-16">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/products">Browse all products</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
