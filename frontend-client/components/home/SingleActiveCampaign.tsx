"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActiveSaleCampaigns } from "@/lib/services/sale-campaign-service";
import { SaleCampaign } from "@/types/sale-campaign";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export const SingleActiveCampaign = () => {
    const [campaign, setCampaign] = useState<SaleCampaign | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const campaigns = await getActiveSaleCampaigns();
                if (campaigns && campaigns.length > 0) {
                    setCampaign(campaigns[0]);
                }
            } catch (error) {
                console.error("Failed to fetch active campaign", error);
            }
        };

        fetchCampaign();
    }, []);

    useEffect(() => {
        if (!campaign) return;

        const calculateTimeLeft = () => {
            const end = new Date(campaign.endTime).getTime();
            const now = new Date().getTime();
            const difference = end - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({
                    hours: hours.toString().padStart(2, "0"),
                    minutes: minutes.toString().padStart(2, "0"),
                    seconds: seconds.toString().padStart(2, "0"),
                });
            } else {
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [campaign]);

    if (!campaign) return null;

    const formatCampaignName = (name: string) => {
        return name.replace(/_/g, " ");
    };

    return (
        <section className="container mx-auto px-4 my-16">
            <div className="border-2 border-black bg-white">
                {/* Marquee Header */}
                <div className="bg-black text-white overflow-hidden py-3 border-b-2 border-black flex relative">
                    <div className="animate-marquee whitespace-nowrap flex gap-8 items-center font-mono font-bold uppercase tracking-widest text-xs">
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="flex items-center gap-4">
                                CHIẾN DỊCH ACTIVE // {formatCampaignName(campaign.name)} <span className="text-[#FF4400]">///</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Left: Info & Timer */}
                    <div className="p-8 lg:w-1/3 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-between bg-zinc-50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "10px 10px" }}
                        />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 border border-black px-3 py-1 bg-white">
                                <span className="w-2 h-2 bg-[#FF4400] rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">ĐANG DIỄN RA</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter">
                                {formatCampaignName(campaign.name)}
                            </h2>

                            {campaign.description && (
                                <p className="font-mono text-xs text-zinc-500 uppercase leading-relaxed max-w-xs">
                                    {campaign.description}
                                </p>
                            )}
                        </div>

                        <div className="mt-12 relative z-10">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-zinc-400">
                                THỜI GIAN CÒN LẠI
                            </div>
                            <div className="flex items-baseline gap-2 font-mono font-black text-6xl tracking-tighter">
                                <span>{timeLeft.hours}</span>
                                <span className="text-zinc-200 animate-pulse">:</span>
                                <span>{timeLeft.minutes}</span>
                                <span className="text-zinc-200 animate-pulse">:</span>
                                <span className="text-[#FF4400]">{timeLeft.seconds}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t-2 border-black/10 flex justify-between items-end relative z-10">
                            <div className="text-right">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                                    TỔNG SẢN PHẨM
                                </div>
                                <div className="font-mono text-2xl font-black">
                                    {campaign.totalItems.toString().padStart(2, '0')}
                                </div>
                            </div>

                            <Link
                                href="/sale-campaigns"
                                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#FF4400] transition-colors"
                            >
                                XEM TẤT CẢ <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Items Grid */}
                    <div className="flex-1 p-0 overflow-x-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 min-w-[600px] h-full">
                            {campaign.items.slice(0, 3).map((item, index) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.productSlug}`}
                                    className={`group relative border-black/10 p-6 flex flex-col justify-between h-full bg-white hover:bg-zinc-50 transition-colors
                                        ${index !== 2 ? 'border-r-2' : ''}
                                    `}
                                >
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                                            -{item.discountPercent}%
                                        </span>
                                    </div>

                                    <div className="relative aspect-square mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                                        {item.imageUrl && (
                                            <Image
                                                src={"http://localhost:8080/uploads/products/" + item.imageUrl}
                                                alt={item.productName}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="h-px w-8 bg-black/20 group-hover:w-full transition-all duration-500" />
                                        <h3 className="font-bold text-xs uppercase tracking-wide line-clamp-2 min-h-[2.5em]">
                                            {item.productName}
                                        </h3>
                                        <div className="flex flex-col font-mono">
                                            <span className="text-[#FF4400] font-black text-lg not-italic">
                                                {formatCurrency(item.salePrice)}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 line-through decoration-zinc-400/50">
                                                {formatCurrency(item.originalPrice)}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1 pt-2">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-zinc-400">
                                                <span>Đã bán: {item.soldCount}</span>
                                                <span>Còn lại: {item.remainingStock}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-100 border border-black/10">
                                                <div
                                                    className="h-full bg-black/80 transition-all duration-1000 block"
                                                    style={{ width: `${Math.min(100, (item.soldCount / item.stockLimit) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* "More" placeholder if fewer items or just to fill grid */}
                            {campaign.items.length < 3 && Array.from({ length: 3 - campaign.items.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="border-r-2 border-black/5 bg-zinc-50/50 flex items-center justify-center">
                                    <span className="font-mono text-zinc-200 text-6xl font-black opacity-20">///</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
