"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/services/product-service";
import type { Category } from "@/types/product";
import { imageUrl } from "@/lib/utils/imageUrl";

export function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    if (categories.length === 0) return null;

    return (
        <div className="container mx-auto px-4 mt-8 mb-8">
            <div className="bg-background border border-border rounded-sm overflow-hidden shadow-md">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30 font-header">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">DANH MỤC</h3>
                    <span className="text-[9px] font-bold opacity-30 text-primary">BỘ_SƯU_TẬP_V4</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
                    {categories.slice(0, 20).map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="group flex flex-col items-center p-6 border-r border-b border-border hover:bg-muted/50 transition-all duration-300"
                        >
                            <div className="relative size-16 mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                {category.imageUrl ? (
                                    <Image
                                        src={imageUrl.category(category.imageUrl)}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 10vw"
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-black/20 font-mono">
                                        N/A
                                    </div>
                                )}
                            </div>
                            <span className="text-[9px] text-center font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors font-header line-clamp-2 px-1">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
