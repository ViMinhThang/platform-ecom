"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/lib/services/product-service";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewList } from "@/components/ReviewList";
import { ProductVariantSection } from "@/components/ProductVariantSection";
import { SellerInfoCard } from "@/components/product/SellerInfoCard";
import { ProductDetail, ProductVariant } from "@/types/product";
import { logger } from "@/lib/logger";
import { imageUrl } from "@/lib/utils/imageUrl";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

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
                <div className="text-center">Loading...</div>
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
            <div className="grid md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border">
                        <Image
                            width={900}
                            height={900}
                            src={imageUrl.product(
                                product.images && product.images.length > 0
                                    ? product.images[currentImageIndex]?.imageUrl || product.images[0].imageUrl
                                    : displayImage
                            )}
                            alt={product.name}
                            className="object-cover w-full h-full transition-all duration-300"
                            unoptimized
                            priority
                        />
                    </div>

                    {/* Thumbnail Carousel */}
                    {product.images && product.images.length > 0 && (
                        <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
                            <CarouselContent className="ml-2">
                                {product.images.map((image, index) => (
                                    <CarouselItem key={index} className="pl-2 basis-1/4">
                                        <div
                                            className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-transparent hover:border-zinc-300"
                                                }`}
                                            onClick={() => {
                                                setCurrentImageIndex(index);
                                                api?.scrollTo(index);
                                            }}
                                        >
                                            <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800">
                                                <Image
                                                    width={200}
                                                    height={200}
                                                    src={imageUrl.product(image.imageUrl)}
                                                    alt={`${product.name} thumbnail ${index + 1}`}
                                                    className="object-cover w-full h-full"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4" />
                            <CarouselNext className="-right-4" />
                        </Carousel>
                    )}
                </div>

                {/* Product Info Section */}
                <div className="space-y-6">
                    <div>
                        <Badge className="mb-2">{product.cate.name}</Badge>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="font-medium text-foreground">
                                    {product.averageRating?.toFixed(1) || "0.0"}
                                </span>
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div>
                                {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                                    .format(product.totalReviews || 0)
                                    .toLowerCase()}{" "}
                                reviews
                            </div>
                            <div className="h-4 w-px bg-border" />
                            <div>
                                {new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
                                    .format(product.totalSold || 0)
                                    .toLowerCase()}+ sold
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground">
                            {product.description || "No description available."}
                        </p>
                    </div>

                    {/* Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="font-semibold mb-3">Specifications</h3>
                            <dl className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="border-b pb-2">
                                        <dt className="text-muted-foreground capitalize">
                                            {key.replace(/_/g, " ")}
                                        </dt>
                                        <dd className="font-medium">{String(value)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Variant Section */}
                    <ProductVariantSection product={product} onVariantChange={setSelectedVariant} />
                </div>
            </div>

            {/* Reviews Section - eBay-style two-column layout */}
            <div className="mt-16 border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left: Seller Info (1/4 width) */}
                    <div className="md:col-span-1">
                        <SellerInfoCard
                            sellerId={product.userId || 0}
                            sellerName={`Seller ${product.userId || 'Unknown'}`}
                        />
                    </div>

                    {/* Right: Reviews (3/4 width) */}
                    <div className="md:col-span-3">
                        <ReviewStats productId={product.id} />
                        <ReviewList productId={product.id} />
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-16 border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <p className="text-muted-foreground">Related products will be shown here</p>
            </div>
        </div>
    );
}
