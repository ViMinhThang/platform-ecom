"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/lib/services/product-service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductEssentials } from "@/components/product/ProductEssentials";
import { ProductDetailedDescription } from "@/components/product/ProductDetailedDescription";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { ProductFeedback } from "@/components/product/ProductFeedback";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductDetail, ProductVariant } from "@/types/product";
import { logger } from "@/lib/logger";

interface ProductDetailPageProps {
    params: any;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
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
            <div className="min-h-screen bg-zinc-50 py-12 px-4 md:px-6 font-mono">
                <div className="max-w-[1400px] mx-auto bg-white border-2 border-black p-12 flex flex-col items-center justify-center min-h-[600px] gap-8">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-black/10"></div>
                        <div className="absolute inset-0 border-4 border-black border-t-transparent animate-spin"></div>
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-xl font-black uppercase tracking-widest">TRUY XUẤT DỮ LIỆU SẢN PHẨM...</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-tighter">PHẢN HỒI HỆ THỐNG: ĐANG XỬ LÝ [OK]</p>
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
        <div className="min-h-screen bg-zinc-50 py-6 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                {/* SYSTEM PATH / BREADCRUMBS */}
                <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    <span>TRANG CHỦ</span>
                    <span>/</span>
                    <span>{product.cate.name}</span>
                    <span>/</span>
                    <span className="text-black">MÃ SP: #{product.id}</span>
                </div>

                <div className="bg-white border-2 border-black">
                    <div className="grid lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px] items-start divide-x-2 divide-black">
                        {/* LEFT: MEDIA SECTION */}
                        <div className="p-8 md:p-12 lg:p-16">
                            <ProductGallery
                                product={product}
                                currentImageIndex={currentImageIndex}
                                setCurrentImageIndex={setCurrentImageIndex}
                                setApi={setApi}
                                api={api}
                                displayImage={displayImage}
                            />
                        </div>

                        {/* RIGHT: CONFIGURATION SECTION */}
                        <div className="p-8 md:p-12 lg:p-16 bg-zinc-50/30">
                            <ProductEssentials
                                product={product}
                                setSelectedVariant={setSelectedVariant}
                            />
                        </div>
                    </div>

                    {/* FULL WIDTH SPEC SHEET SECTION */}
                    <div className="border-t-2 border-black">
                        <div className="grid lg:grid-cols-2 divide-x-2 divide-black divide-y-2 lg:divide-y-0">
                            <div className="p-8 md:p-12">
                                <ProductSpecifications product={product} />
                            </div>
                            <div className="p-8 md:p-12">
                                <ProductDetailedDescription product={product} />
                            </div>
                        </div>
                    </div>

                    {/* FIELD REPORTS / FEEDBACK */}
                    <div className="border-t-2 border-black p-8 md:p-12">
                        <ProductFeedback product={product} />
                    </div>
                </div>

                {/* RELATED COMPONENTS SECTION */}
                <div className="mt-12">
                    <RelatedProducts productId={product.id} />
                </div>
            </div>
        </div>
    );
}
