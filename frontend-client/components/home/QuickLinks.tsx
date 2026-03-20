"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { imageUrl } from "@/lib/utils/imageUrl";

export const QuickLinks = () => {
    const { categories, loading } = useCategories();

    if (loading && categories.length === 0) return null;
    if (categories.length === 0) return null;

    return (
        <div className="container mx-auto px-4 mt-8 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 border-l border-t border-border rounded-sm overflow-hidden shadow-sm">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="flex flex-col items-center gap-4 p-6 group border-r border-b border-border bg-background hover:bg-muted/50 transition-all duration-300"
                    >
                        <div className="relative w-10 h-10 grayscale group-hover:grayscale-0 transition-all duration-500">
                            {category.imageUrl ? (
                                <Image
                                    src={imageUrl.category(category.imageUrl)}
                                    alt={category.name}
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-black/20 font-mono">
                                    N/A
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] text-center font-bold uppercase tracking-[0.15em] leading-tight text-foreground group-hover:text-primary transition-colors">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
