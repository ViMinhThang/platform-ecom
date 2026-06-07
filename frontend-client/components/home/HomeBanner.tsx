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
        <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12 py-8">
            <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden rounded-lg shadow-sunlight">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/hero.avif"
                        alt="ACME - Bộ sưu tập mới"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Atmospheric Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Main Content */}
                <div className="h-full relative z-10 flex flex-col justify-center pb-20 px-8 md:px-16 lg:px-32 max-w-5xl">
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div>
                            <span className="inline-block px-4 py-1 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white ghost-border">
                                Bộ sưu tập đặc biệt
                            </span>
                        </div>
                        
                        <h1 className="font-header text-5xl md:text-7xl lg:text-[100px] text-white leading-[0.9] tracking-tighter max-w-3xl font-semibold">
                            Bộ sưu tập <br />
                            Hè Năng động <br />
                            2024
                        </h1>

                        <p className="text-white/80 text-sm md:text-lg font-medium max-w-md leading-relaxed">
                            Những món đồ thiết yếu được tuyển chọn, cùng bạn chuyển động. 
                            Khám phá ngôn ngữ thiết kế tham vọng nhất của chúng tôi.
                        </p>

                        <div className="pt-6">
                            <Link 
                                href="/category/collections" 
                                className="inline-flex items-center gap-3 bg-primary text-white hover:brightness-110 px-10 py-4 text-[13px] font-bold rounded-full transition-all shadow-xl active:scale-95"
                            >
                                Khám phá Bộ sưu tập
                                <MoveRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
