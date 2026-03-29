'use client';

import Image from "next/image";
import { imageUrl } from "@/lib/utils/imageUrl";
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
    displayImage
}: ProductGalleryProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* THUMBNAIL STRIP: VERTICAL LEFT */}
            {product.images && product.images.length > 0 && (
                <div className="flex flex-row md:flex-column md:flex-col gap-4 w-full md:w-24 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar">
                    {product.images.map((image, index) => (
                        <button
                            key={index}
                            className={`relative min-w-[70px] md:w-full aspect-[4/5] overflow-hidden border transition-all duration-300 rounded-sm bg-secondary/5 ${currentImageIndex === index
                                    ? "border-primary ring-1 ring-primary/20 opacity-100"
                                    : "border-foreground/5 opacity-50 hover:opacity-100 hover:border-foreground/20"
                                }`}
                            onMouseEnter={() => setCurrentImageIndex(index)}
                        >
                            <Image
                                fill
                                src={imageUrl.product(image.imageUrl)}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className="object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* MAIN DISPLAY: RIGHT */}
            <div className="flex-1 w-full order-1 md:order-2">
                <div className="aspect-[4/5] relative bg-white/50 overflow-hidden border border-foreground/5 rounded-sm group cursor-crosshair">
                    <Image
                        fill
                        src={imageUrl.product(
                            product.images && product.images.length > 0
                                ? product.images[currentImageIndex]?.imageUrl || product.images[0].imageUrl
                                : displayImage
                        )}
                        alt={product.name}
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized
                        priority
                    />
                    
                    {/* BỘ SƯU TẬP WATERMARK / BADGE */}
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                         <div className="bg-white/80 backdrop-blur-md px-4 py-2 border border-foreground/5 rounded-sm">
                             <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground font-labels">ACME ARCHIVES</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
