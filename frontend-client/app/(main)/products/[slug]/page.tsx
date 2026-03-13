"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/lib/services/product-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductEssentials } from "@/components/product/ProductEssentials";
import { ProductDetailedDescription } from "@/components/product/ProductDetailedDescription";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { ProductFeedback } from "@/components/product/ProductFeedback";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { SellerInfoCard } from "@/components/product/SellerInfoCard";
import { ProductDetail, ProductVariant } from "@/types/product";
import { logger } from "@/lib/logger";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ProductDetailPageProps {
    params: any;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { trackProductView } = useAnalytics();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<any>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setCurrentImageIndex(api.selectedScrollSnap());
        });
    }, [api]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { slug } = await params;
                const data = await getProductBySlug(slug);
                logger.debug('Fetched product data:', { data });
                setProduct(data);
                
                trackProductView(data.id, undefined, data.cate.id, data.userId);
            } catch (error) {
                logger.error("Failed to fetch product:", error);
                notFound();
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background/50 py-12 px-4 md:px-6">
                <div className="max-w-[1400px] mx-auto bg-background border border-border rounded-sm shadow-md p-12 flex flex-col items-center justify-center min-h-[600px] gap-8">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-2 border-primary/10 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-xl font-bold uppercase tracking-widest text-foreground">ĐANG TẢI SẢN PHẨM...</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-50 font-header">OCEANIC_EMERALD_STREAM</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        notFound();
    }

    const displayImage =
        selectedVariant?.imageUrl ||
        product.metadata?.imageUrl ||
        "https://placeholder.com/600";

    return (
        <div className="min-h-screen bg-background/50 pb-12 font-header text-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* BREADCRUMBS */}
                <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="hover:text-primary transition-colors cursor-pointer">{product.cate.name}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-foreground truncate max-w-[500px]">{product.name}</span>
                </div>

                {/* MAIN PRODUCT CARD */}
                <div className="bg-background rounded-sm shadow-md border border-border overflow-hidden mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-border">
                        {/* LEFT: GALLERY */}
                        <div className="lg:col-span-5 p-6 xl:p-8">
                            <ProductGallery
                                product={product}
                                currentImageIndex={currentImageIndex}
                                setCurrentImageIndex={setCurrentImageIndex}
                                setApi={setApi}
                                api={api}
                                displayImage={displayImage}
                            />
                        </div>

                        {/* RIGHT: ESSENTIALS */}
                        <div className="lg:col-span-7 p-6 xl:p-8 flex flex-col">
                            <ProductEssentials
                                product={product}
                                setSelectedVariant={setSelectedVariant}
                            />
                        </div>
                    </div>
                </div>

                {/* CONTENT STACK */}
                <div className="space-y-6">


                    {/* PRODUCT DETAILS */}
                    <div className="bg-background rounded-sm shadow-md border border-border overflow-hidden">
                        <div className="bg-muted/30 border-b border-border px-6 py-4">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Chi Tiết Sản Phẩm</h3>
                        </div>
                        <div className="p-6 space-y-8">
                            <ProductSpecifications product={product} />
                            <div className="prose prose-zinc max-w-none prose-sm">
                                <ProductDetailedDescription product={product} />
                            </div>
                        </div>
                    </div>

                    {/* REVIEWS */}
                    <div className="bg-background rounded-sm shadow-md border border-border overflow-hidden">
                        <div className="bg-muted/30 border-b border-border px-6 py-4">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Đánh Giá ({product.totalReviews})</h3>
                        </div>
                        <div className="p-6">
                            <ProductFeedback product={product} />
                        </div>
                    </div>

                    {/* RELATED PRODUCTS */}
                    <div className="bg-background rounded-sm shadow-md border border-border overflow-hidden">
                        <div className="bg-muted/30 border-b border-border px-6 py-4">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Có Thể Bạn Thích</h3>
                        </div>
                        <div className="p-6">
                            <RelatedProducts productId={product.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
