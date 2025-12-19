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
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="text-center">Đang tải...</div>
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
        <div className="container mx-auto py-8 px-4 md:px-6">
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

            <div className="mt-16 space-y-16 max-w-5xl mx-auto">
                <ProductDetailedDescription product={product} />
                <ProductFeedback product={product} />
            </div>

            <RelatedProducts productId={product.id} />
        </div>
    );
}
