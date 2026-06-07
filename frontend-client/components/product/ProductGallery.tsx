'use client';

import Image from "next/image";
import { imageUrl } from "@/lib/utils/imageUrl";
import { ProductDetail } from "@/types/product";

interface ProductGalleryProps {
    product: ProductDetail;
    currentImageIndex: number;
    setCurrentImageIndex: (index: number) => void;
}

export const ProductGallery = ({
    product,
    currentImageIndex,
    setCurrentImageIndex,
}: ProductGalleryProps) => {
    return (
        <div className="space-y-6">
            {/* MAIN DISPLAY: TOP */}
            <div className="w-full">
                <div className="aspect-square md:aspect-[4/5] relative bg-surface-container rounded-3xl overflow-hidden group cursor-crosshair shadow-sm">
                    <Image
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        src={imageUrl.product(
                            product.images && product.images.length > 0
                                ? product.images[currentImageIndex]?.imageUrl || product.images[0].imageUrl
                                : "/placeholder.png"
                        )}
                        alt={product.name}
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized
                        priority
                    />
                    
                    {/* EDITORIAL BADGE */}
                    <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                         <div className="bg-white/40 backdrop-blur-md px-5 py-2 border border-white/20 rounded-full ghost-border">
                             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Lưu trữ ACME</p>
                         </div>
                    </div>
                </div>
            </div>

            {/* THUMBNAIL GRID: BOTTOM */}
            {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {product.images.map((image, index) => (
                        <button
                            key={image.id}
                            className={`relative aspect-square overflow-hidden rounded-2xl transition-all duration-500 bg-surface-container ${currentImageIndex === index
                                    ? "ring-2 ring-primary ring-offset-4 ring-offset-background opacity-100 scale-[0.98]"
                                    : "opacity-60 hover:opacity-100 hover:scale-[1.02]"
                                }`}
                            onClick={() => setCurrentImageIndex(index)}
                        >
                            <Image
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                src={imageUrl.product(image.imageUrl)}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className="object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
