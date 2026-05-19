"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CampaignBanners = () => {
    return (
        <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[400px]">
                {/* THE BLUE ERA */}
                <div className="md:col-span-8 bg-[#d4e3ff] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                    <div className="flex-1 p-10 md:p-16 flex flex-col justify-center space-y-6">
                        <h2 className="font-header text-4xl md:text-5xl font-bold text-[#001c38] tracking-tight">
                            Kỷ nguyên Xanh
                        </h2>
                        <p className="text-[#001c38]/60 text-sm md:text-base font-medium max-w-xs leading-relaxed">
                            Trải nghiệm sự tổng hòa hoàn hảo giữa hiệu năng và thẩm mỹ đại dương sâu thẳm.
                        </p>
                        <div>
                            <Link 
                                href="/category/blue-era" 
                                className="inline-flex items-center justify-center rounded-lg bg-[#0959b6] px-8 py-3 text-sm font-bold text-white shadow transition-colors hover:bg-[#001c38]"
                            >
                                Khám phá
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative min-h-[300px] md:min-h-full">
                        <Image
                            src="/banner-grid-1.avif"
                            alt="The Blue Era"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* FLASH SALE */}
                <div className="md:col-span-4 bg-[#e8d5f3] rounded-xl overflow-hidden relative shadow-sm group">
                    <Image
                        src="/banner-3.png"
                        alt="Flash Sale"
                        fill
                        className="object-cover opacity-80 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-purple-900/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 md:p-12 flex flex-col justify-end space-y-4">
                        <div className="space-y-1">
                            <h3 className="font-header text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Săn ưu đãi Chớp nhoáng
                            </h3>
                            <p className="text-white/80 text-[11px] md:text-xs font-medium max-w-[200px]">
                                Chỉ trong 48 giờ. Giảm giá đến 60% cho các sản phẩm tiêu biểu.
                            </p>
                        </div>
                        <div>
                            <Link 
                                href="/sale" 
                                className="inline-flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-md px-6 py-2.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-white hover:text-purple-900 ghost-border border-white/40"
                            >
                                Xem ưu đãi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
