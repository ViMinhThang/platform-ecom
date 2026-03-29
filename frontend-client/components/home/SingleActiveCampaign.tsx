"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { getActiveSaleCampaigns } from "@/lib/services/sale-campaign-service";
import { SaleCampaign } from "@/types/sale-campaign";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { imageUrl } from "@/lib/utils/imageUrl";

export const SingleActiveCampaign = () => {
    const [campaign, setCampaign] = useState<SaleCampaign | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>({
        days: "00",
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
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({
                    days: days.toString().padStart(2, "0"),
                    hours: hours.toString().padStart(2, "0"),
                    minutes: minutes.toString().padStart(2, "0"),
                    seconds: seconds.toString().padStart(2, "0"),
                });
            } else {
                setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [campaign]);

    if (!campaign) return null;

    const formatCampaignName = (name: string) => {
        return name.replace(/_/g, " ").toUpperCase();
    };

    return (
        <section className="w-[1600px] mx-auto my-20">
            <div className="bg-white border border-foreground/10 rounded-[4px] overflow-hidden shadow-sm">
                {/* MARQUEE HEADER: SCHOLARLY TICKER */}
                <div className="bg-primary text-white overflow-hidden py-3 flex relative">
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center font-labels font-bold uppercase tracking-[0.4em] text-[10px]">
                        {[...Array(12)].map((_, i) => (
                            <span key={i} className="flex items-center gap-6">
                                <Zap className="w-3 h-3 fill-current" />
                                {formatCampaignName(campaign.name)}
                                <span className="text-white/30">///</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-foreground/5">
                    {/* LEFT: DOSSIER IDENTITY */}
                    <div className="p-12 lg:w-[480px] flex flex-col justify-between bg-secondary/5 relative overflow-hidden shrink-0">
                        {/* Archival Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: "radial-gradient(circle, var(--foreground) 1px, transparent 1px)", backgroundSize: "12px 12px" }}
                        />

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-3 border border-primary/20 px-4 py-1.5 bg-white rounded-full shadow-sm">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary font-labels">FLASH SALE</span>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-[52px] font-bold uppercase leading-[0.85] tracking-tighter text-foreground font-labels">
                                    {formatCampaignName(campaign.name)}
                                </h2>
                                {campaign.description && (
                                    <p className="font-labels text-[10px] text-foreground/40 uppercase tracking-widest leading-relaxed max-w-xs">
                                        {campaign.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-16 space-y-10 relative z-10">
                            <div className="space-y-6">
                                <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/30 font-labels">
                                    THỜI GIAN KẾT THÚC CÒN
                                </div>
                                <div className="flex items-start gap-4 font-labels font-bold text-5xl tracking-tighter text-foreground">
                                    <div className="flex flex-col items-center">
                                        <span>{timeLeft.days}</span>
                                        <span className="text-[8px] tracking-[0.4em] text-foreground/20 mt-2 uppercase">Ngày</span>
                                    </div>
                                    <span className="text-primary/20 pt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span>{timeLeft.hours}</span>
                                        <span className="text-[8px] tracking-[0.4em] text-foreground/20 mt-2 uppercase">Giờ</span>
                                    </div>
                                    <span className="text-primary/20 pt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span>{timeLeft.minutes}</span>
                                        <span className="text-[8px] tracking-[0.4em] text-foreground/20 mt-2 uppercase">Phút</span>
                                    </div>
                                    <span className="text-primary/20 pt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-primary">{timeLeft.seconds}</span>
                                        <span className="text-[8px] tracking-[0.4em] text-primary/40 mt-2 uppercase">Giây</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-foreground/5 flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 font-labels">
                                        SẢN PHẨM LƯU TRỮ
                                    </div>
                                    <div className="font-labels text-3xl font-bold text-foreground tracking-tighter">
                                        {campaign.totalItems.toString().padStart(2, '0')}+
                                    </div>
                                </div>

                                <Link
                                    href="/sale-campaigns"
                                    className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-all font-labels border-b border-primary/10 pb-1"
                                >
                                    XEM TẤT CẢ <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: CURATED EXHIBITS */}
                    <div className="flex-1 p-0 overflow-x-auto bg-white scrollbar-hide">
                        <div className="grid grid-cols-2 lg:grid-cols-3 min-w-[750px] h-full divide-x divide-foreground/5">
                            {campaign.items.slice(0, 3).map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.productSlug}`}
                                    className="group relative p-10 flex flex-col justify-between h-full bg-white hover:bg-secondary/5 transition-all duration-500"
                                >
                                    <div className="absolute top-6 right-6 z-10">
                                        <div className="bg-primary text-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-[2px] shadow-sm">
                                            GIẢM {item.discountPercent}%
                                        </div>
                                    </div>

                                    <div className="relative aspect-square mb-10 grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700">
                                        {item.imageUrl && (
                                            <Image
                                                src={imageUrl.product(item.imageUrl)}
                                                alt={item.productName}
                                                fill
                                                className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                                unoptimized
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="h-px w-8 bg-primary/20 group-hover:w-full transition-all duration-700" />
                                        <div className="space-y-2">
                                            <h3 className="font-labels font-bold text-[11px] uppercase tracking-wider line-clamp-2 min-h-[2.5em] text-foreground leading-relaxed">
                                                {item.productName}
                                            </h3>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-primary font-bold text-2xl tracking-tighter font-labels">
                                                    {formatCurrency(item.salePrice)}
                                                </span>
                                                <span className="text-[10px] font-bold text-foreground/20 line-through decoration-foreground/10 font-labels tracking-widest">
                                                    {formatCurrency(item.originalPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Minimal Progress Bar */}
                                        <div className="space-y-2 pt-4 border-t border-foreground/5">
                                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/30 font-labels">
                                                <span>ĐÃ ACQUIRED: {item.soldCount}</span>
                                                <span>CÒN LẠI: {item.remainingStock}</span>
                                            </div>
                                            <div className="h-[2px] w-full bg-foreground/5 overflow-hidden rounded-full">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000 block"
                                                    style={{ width: `${Math.max(5, (item.soldCount / item.stockLimit) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* Empty Slots */}
                            {campaign.items.length < 3 && Array.from({ length: 3 - campaign.items.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-secondary/2 flex items-center justify-center">
                                    <span className="font-labels text-foreground/5 text-8xl font-black">ACME</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
