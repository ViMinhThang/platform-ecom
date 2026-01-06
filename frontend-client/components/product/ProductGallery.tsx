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
            <div className="aspect-square relative bg-white border-2 border-black overflow-hidden group">
                {/* BLUEPRINT GRID OVERLAY */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-size-[20px_20px]"></div>

                <Image
                    width={800}
                    height={800}
                    src={imageUrl.product(
                        product.images && product.images.length > 0
                            ? product.images[currentImageIndex]?.imageUrl || product.images[0].imageUrl
                            : displayImage
                    )}
                    alt={product.name}
                    className="object-contain w-full h-full p-4"
                    unoptimized
                    priority
                />
            </div>

            {/* THUMBNAIL TRACKER */}
            {product.images && product.images.length > 0 && (
                <div className="relative">
                    <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
                        <CarouselContent className="-ml-2">
                            {product.images.map((image, index) => (
                                <CarouselItem key={index} className="pl-2 basis-1/5">
                                    <div
                                        className={`cursor-pointer border-2 transition-all p-1 ${currentImageIndex === index
                                            ? "border-black bg-zinc-100"
                                            : "border-zinc-200 hover:border-black/50"
                                            }`}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            api?.scrollTo(index);
                                        }}
                                    >
                                        <div className="aspect-square relative bg-white">
                                            <Image
                                                width={150}
                                                height={150}
                                                src={imageUrl.product(image.imageUrl)}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                className="object-contain w-full h-full"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="h-full rounded-none border-2 border-black bg-white hover:bg-black hover:text-white -left-4 w-10 disabled:opacity-0" />
                        <CarouselNext className="h-full rounded-none border-2 border-black bg-white hover:bg-black hover:text-white -right-4 w-10 disabled:opacity-0" />
                    </Carousel>
                </div>
            )}
        </div>
    );
};
