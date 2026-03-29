"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MoveRight, Laptop, Shirt, BookText, Home, GraduationCap, Package } from "lucide-react";
import { useGetCategoriesQuery } from "@/lib/store/api/clientApi";

export const HomeBanner = () => {
    const { data: categories } = useGetCategoriesQuery();

    const getIcon = (slug: string) => {
        const lowerSlug = slug.toLowerCase();
        if (lowerSlug.includes('electronic')) return Laptop;
        if (lowerSlug.includes('apparel')) return Shirt;
        if (lowerSlug.includes('literature')) return BookText;
        if (lowerSlug.includes('living')) return Home;
        if (lowerSlug.includes('scholarship')) return GraduationCap;
        return Package;
    };

    return (
        <section className="w-[1600px] mx-auto py-8">
            <div className="relative w-full h-[700px] overflow-hidden rounded-md shadow-lg">
                {/* Background Image with Archival Tint */}
                <div className="absolute inset-0">
                    <Image
                        src="/hero.jpg"
                        alt="ACME Collection"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Refined Atmospheric Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Main Content Area */}
                <div className="h-full relative z-10 flex flex-col justify-center pb-32 px-12 md:px-32 max-w-5xl">
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <span className="inline-block text-tertiary font-bold uppercase tracking-[0.4em] text-[10px]">
                            BỘ SƯU TẬP MỚI
                        </span>
                        
                        <h1 className="font-header text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight max-w-2xl">
                            Vẻ đẹp di sản <br />
                            giữa đời thường.
                        </h1>

                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed italic font-header opacity-90">
                            Khám phá những vật phẩm lưu trữ về thời trang, 
                            điện tử hiệu năng cao và đồ gia dụng tinh xảo.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-12">
                            <Link 
                                href="/category/collections" 
                                className="flex items-center gap-3 bg-primary text-white hover:bg-primary/90 px-10 py-5 text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-lg"
                            >
                                Khám phá ngay
                                <MoveRight className="h-4 w-4" />
                            </Link>
                            
                            <Link 
                                href="/category/rare-finds" 
                                className="bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                            >
                                Đồ quý hiếm
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Department Bar (Integrated) */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-xl border-t border-white/10">
                    <div className="px-12 md:px-32 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-10 overflow-x-auto scrollbar-hide">
                            {categories?.slice(0, 5).map((cat) => {
                                const Icon = getIcon(cat.slug);
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className="flex items-center gap-3 group whitespace-nowrap"
                                    >
                                        <Icon className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                                            {cat.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="hidden lg:block">
                            <span className="text-[9px] italic font-header text-white/30 tracking-[0.2em]">
                                Duyệt theo danh mục
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
