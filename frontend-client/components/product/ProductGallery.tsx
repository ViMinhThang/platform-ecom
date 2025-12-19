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
        <div className="space-y-6">
            <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800 overflow-hidden border">
                <Image
                    width={700}
                    height={700}
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

            {product.images && product.images.length > 0 && (
                <div className="px-6">
                    <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
                        <CarouselContent className="ml-1">
                            {product.images.map((image, index) => (
                                <CarouselItem key={index} className="pl-1 basis-1/4">
                                    <div
                                        className={`cursor-pointer overflow-hidden border-2 transition-all ${currentImageIndex === index
                                            ? "border-primary"
                                            : "border-transparent hover:border-zinc-300"
                                            }`}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            api?.scrollTo(index);
                                        }}
                                    >
                                        <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800">
                                            <Image
                                                width={150}
                                                height={150}
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
                        <CarouselPrevious className="-left-8 rounded-none h-full border-none bg-transparent hover:bg-zinc-100 w-8" />
                        <CarouselNext className="-right-8 rounded-none h-full border-none bg-transparent hover:bg-zinc-100 w-8" />
                    </Carousel>
                </div>
            )}
        </div>
    );
};
