"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Timer } from "lucide-react";

// Mock data
const FLASH_DEALS = [
    { id: 1, image: "/hero.jpg", price: "99.000₫", discount: "-50%", sold: 85 },
    { id: 2, image: "/banner-2.jpg", price: "150.000₫", discount: "-30%", sold: 12 },
    { id: 3, image: "/banner-3.jpg", price: "299.000₫", discount: "-45%", sold: 90 },
    { id: 4, image: "/hero.jpg", price: "59.000₫", discount: "-10%", sold: 5 },
    { id: 5, image: "/banner-2.jpg", price: "12.000₫", discount: "-90%", sold: 99 },
    { id: 6, image: "/banner-3.jpg", price: "899.000₫", discount: "-20%", sold: 40 },
];

export const FlashSale = () => {
    return (
        <div className="container mx-auto px-4 mt-8 mb-8">
            <div className="bg-white border-2 border-black overflow-hidden">
                {/* Header */}
                <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b-2 border-black">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Timer className="h-6 w-6 text-primary" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Giá sốc hôm nay</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-black">
                            <span className="opacity-50 text-[10px]">KẾT THÚC SAU:</span>
                            <div className="flex items-center gap-1 font-mono">
                                <span className="bg-primary text-white px-2 py-0.5">02</span>
                                <span className="text-white">:</span>
                                <span className="bg-primary text-white px-2 py-0.5">15</span>
                                <span className="text-white">:</span>
                                <span className="bg-primary text-white px-2 py-0.5">45</span>
                            </div>
                        </div>
                    </div>
                    <Link href="/flash-sale" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
                        Xem tất cả <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* List */}
                <div className="p-2 overflow-x-auto pb-6 no-scrollbar">
                    <div className="flex gap-4 min-w-max p-2">
                        {FLASH_DEALS.map((item) => (
                            <div key={item.id} className="w-[150px] md:w-[170px] flex flex-col gap-3 group cursor-pointer border border-transparent hover:border-black transition-all p-2 bg-white">
                                <div className="relative aspect-square overflow-hidden border border-black/5 group-hover:border-black bg-zinc-100 grayscale hover:grayscale-0 transition-all duration-500">
                                    <Image src={item.image} alt="Deal" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter">
                                        Giảm {item.discount.replace('-', '')}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-lg font-black font-mono text-primary leading-none tracking-tighter">{item.price}</div>
                                    <div className="relative w-full h-4 bg-zinc-200 border border-black/5 overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-black transition-all duration-1000"
                                            style={{ width: `${item.sold}%` }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white mix-blend-difference uppercase tracking-tighter">
                                            Đã bán {item.sold}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
