"use client";

import Image from "next/image";
import Link from "next/link";

import { useGetCategoriesQuery } from "@/lib/store/api/clientApi";

// Mapping fallback images for categories that might not have them in backend
const CATEGORY_IMAGES: Record<string, string> = {
    "footwear": "/banner-grid-1.avif",
    "electronics": "/banner-2.png",
    "wellness": "/banner-3.png",
    "audio": "/banner-4.png",
    "home-living": "/banner-grid-1.avif",
    "accessories": "/banner-2.png",
};

export const CuratedCollections = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();

    if (isLoading) {
        return (
            <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-surface-container/50 rounded-xl animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-header text-xl md:text-2xl font-bold text-foreground">
                    Khám phá Danh mục
                </h2>
                <Link href="/products" className="text-[13px] font-bold text-foreground/40 hover:text-primary transition-colors flex items-center gap-1">
                    Xem tất cả <span className="text-xs">›</span>
                </Link>
            </div>

            {/* CATEGORY GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
                {(categories || []).slice(0, 6).map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container/30"
                    >
                        <Image
                            src={"http://localhost:8080/uploads/"+cat.imageUrl || CATEGORY_IMAGES[cat.slug] || "/banner-grid-1.avif"}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                            <span className="font-bold text-[13px] md:text-sm text-white tracking-tight drop-shadow-md">
                                {cat.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
