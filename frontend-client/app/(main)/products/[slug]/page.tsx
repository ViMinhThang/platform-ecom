"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useGetProductBySlugQuery } from "@/lib/store/api/clientApi";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductEssentials } from "@/components/product/ProductEssentials";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { ProductFeedback } from "@/components/product/ProductFeedback";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductVariant } from "@/types/product";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getSellerInfo, SellerInfo } from "@/lib/services/user-service";
import { Button } from "@/components/ui/button";

interface ProductDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = use(params);
    const { trackProductView } = useAnalytics();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [api, setApi] = useState<any>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [seller, setSeller] = useState<SellerInfo | null>(null);
    
    const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);

    useEffect(() => {
        const fetchSeller = async () => {
            if (product?.userId) {
                try {
                    const info = await getSellerInfo(product.userId);
                    setSeller(info);
                } catch (err) {
                    console.error("Failed to fetch seller info", err);
                }
            }
        };
        fetchSeller();
    }, [product?.userId]);

    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setCurrentImageIndex(api.selectedScrollSnap());
        });
    }, [api]);

    useEffect(() => {
        if (product) {
            trackProductView(product.id, undefined, product.cate.id, product.userId);
        }
    }, [product, trackProductView]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-foreground/50 animate-pulse">Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (isError || !product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground antialiased pb-32">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-8">
                {/* BREADCRUMBS (Integrated) */}
                <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/30 mb-8 md:mb-12">
                    <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link href={`/category/${product.cate.slug}`} className="hover:text-primary transition-colors">{product.cate.name}</Link>
                    <span>/</span>
                    <span className="text-foreground/80">{product.name}</span>
                </nav>

                {/* HERO GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
                    {/* Gallery Left */}
                    <div className="lg:col-span-7">
                        <ProductGallery
                            product={product}
                            currentImageIndex={currentImageIndex}
                            setCurrentImageIndex={setCurrentImageIndex}
                        />
                    </div>

                    {/* Product Info Right */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                                    Phiên bản Giới hạn
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                    + Bộ sưu tập Thủ công
                                </span>
                            </div>

                            <h1 className="font-header text-4xl md:text-6xl font-extrabold leading-[0.95] tracking-tighter text-foreground">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 text-xs font-bold">
                                <div className="flex items-center gap-1 text-primary">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-foreground/40">{product.totalReviews || 120} đánh giá</span>
                            </div>

                            <div className="text-4xl font-bold tracking-tighter text-foreground pt-2">
                                {formatCurrency(selectedVariant?.salePrice || selectedVariant?.price || product.minPrice)}
                            </div>
                        </div>

                        <ProductEssentials
                            product={product}
                            setSelectedVariant={setSelectedVariant}
                        />
                    </div>
                </div>

                {/* STORYTELLING SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
                    <div className="lg:col-span-2 bg-surface-container rounded-3xl p-10 md:p-16 space-y-10">
                        <div className="space-y-6">
                            <h2 className="font-header text-3xl md:text-4xl font-bold tracking-tight">
                                Thiết kế cho Không gian Tinh tế
                            </h2>
                            <div className="prose prose-zinc max-w-none text-foreground/70 leading-relaxed text-sm md:text-base selection:bg-primary/10">
                                <div dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                            </div>
                        </div>

                        <ProductSpecifications product={product} />
                    </div>

                    <div className="bg-primary rounded-3xl p-10 md:p-14 flex flex-col justify-between text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-8">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-header text-2xl md:text-3xl font-bold leading-tight">Cam kết Bền vững</h3>
                                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                                    Với mỗi sản phẩm thủ công, chúng tôi trích 5% lợi nhuận để hỗ trợ cộng đồng nghệ nhân địa phương và bảo vệ môi trường.
                                </p>
                            </div>
                        </div>
                        <div className="absolute right-[-20%] bottom-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                             <ShieldCheck className="w-64 h-64" />
                        </div>
                    </div>
                </div>

                {/* REVIEWS: Community Voices */}
                <div className="mb-32">
                    <div className="flex items-end justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="font-header text-3xl md:text-4xl font-bold tracking-tight">Tiếng nói Cộng đồng</h2>
                            <p className="text-[13px] font-medium text-foreground/40 italic">120 người đã chia sẻ trải nghiệm</p>
                        </div>
                    </div>
                    
                    <div className="w-full">
                        <ProductFeedback product={product} />
                    </div>
                </div>

                {/* RELATED: Complete the Curation */}
                <div className="space-y-12">
                    <div className="space-y-1">
                        <h2 className="font-header text-3xl md:text-4xl font-bold tracking-tight">Hoàn thiện Bộ sưu tập</h2>
                        <p className="text-[13px] font-medium text-foreground/40 italic">Những gợi ý phối hợp dành riêng cho bạn</p>
                    </div>
                    <RelatedProducts productId={product.id} />
                </div>
            </div>
        </div>
    );
}
