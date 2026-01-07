'use client';

import Image from "next/image";
import { imageUrl } from "@/lib/utils/imageUrl";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductDetail } from "@/types/product";

interface ProductGalleryProps {
    product: ProductDetail;
    currentImageIndex: number;
    setCurrentImageIndex: (index: number) => void;
    setApi: (api: any) => void;
    api: any;
    displayImage: string;
}

export const ProductGallery = ({
    product,
    currentImageIndex,
    setCurrentImageIndex,
    setApi,
    api,
    displayImage
}: ProductGalleryProps) => {
    return (
        <div className="space-y-4">
            {/* MAIN DISPLAY */}
            <div className="aspect-square relative bg-white border border-slate-100 overflow-hidden rounded-lg cursor-zoom-in group">
                <Image
                    width={800}
                    height={800}
                    src={imageUrl.product(
                        product.images && product.images.length > 0
                            ? product.images[currentImageIndex]?.imageUrl || product.images[0].imageUrl
                            : displayImage
                    )}
                    alt={product.name}
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                    priority
                />
            </div>

            {/* THUMBNAIL STRIP */}
            {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                    {product.images.map((image, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer aspect-square rounded-md overflow-hidden bg-white border transition-all ${currentImageIndex === index
                                    ? "border-[#FF4F00] ring-1 ring-[#FF4F00] shadow-sm"
                                    : "border-slate-200 hover:border-[#FF4F00]/50"
                                }`}
                            onMouseEnter={() => setCurrentImageIndex(index)}
                        >
                            <div className="w-full h-full relative p-1">
                                <Image
                                    width={100}
                                    height={100}
                                    src={imageUrl.product(image.imageUrl)}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className="object-contain w-full h-full"
                                    unoptimized
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
