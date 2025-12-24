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
            <div className="min-h-screen bg-background py-8 px-4 md:px-6">
                <div className="max-w-[1600px] mx-auto bg-card shadow-sm border border-border/50 p-12">
                    <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-muted-foreground font-medium">Đang tải sản phẩm...</p>
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
        "https://placehold.co/600x600";

    return (
        <div className="min-h-screen bg-background py-8 px-4 md:px-6">
            <div className="max-w-[1600px] mx-auto bg-card shadow-sm border border-border/50 p-10 md:p-16 lg:p-24">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[42%_1fr] gap-12 items-start">
                    <ProductGallery
                        product={product}
                        currentImageIndex={currentImageIndex}
                        setCurrentImageIndex={setCurrentImageIndex}
                        setApi={setApi}
                        api={api}
                        displayImage={displayImage}
                    />

                    <ProductEssentials
                        product={product}
                        setSelectedVariant={setSelectedVariant}
                    />
                </div>

                <div className="mt-32 space-y-32 max-w-7xl mx-auto">
                    <ProductDetailedDescription product={product} />
                    <ProductFeedback product={product} />
                </div>

                <div className="mt-32">
                    <RelatedProducts productId={product.id} />
                </div>
            </div>
        </div>
    );
}
