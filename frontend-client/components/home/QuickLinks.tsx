"use client";

import Link from "next/link";
import { useGetCategoriesQuery } from "@/lib/store/api/clientApi";
import { Laptop, Shirt, BookText, Home, GraduationCap, Package } from "lucide-react";

export const QuickLinks = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();

    const getIcon = (slug: string) => {
        const lowerSlug = slug.toLowerCase();
        if (lowerSlug.includes('electronic')) return Laptop;
        if (lowerSlug.includes('apparel') || lowerSlug.includes('thoi-trang')) return Shirt;
        if (lowerSlug.includes('literature') || lowerSlug.includes('sach')) return BookText;
        if (lowerSlug.includes('living') || lowerSlug.includes('gia-dung')) return Home;
        if (lowerSlug.includes('scholarship') || lowerSlug.includes('hoc-thuat')) return GraduationCap;
        return Package;
    };

    if (isLoading || !categories) {
        return (
            <div className="w-full bg-[#1c1917] py-6">
                <div className="container mx-auto px-6 flex items-center gap-12 overflow-x-auto scrollbar-hide py-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="h-4 w-4 bg-white/10 rounded-full" />
                            <div className="h-2 w-16 bg-white/10 rounded-sm" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#1c1917] text-white py-6">
            <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-10 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map((cat) => {
                        const Icon = getIcon(cat.slug);
                        return (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="flex items-center gap-3 group whitespace-nowrap"
                            >
                                <Icon className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors group-hover:text-white">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden lg:block">
                    <span className="text-[10px] opacity-40 tracking-widest uppercase font-bold">
                        DUYỆT THEO DANH MỤC
                    </span>
                </div>
            </div>
        </div>
    );
};
