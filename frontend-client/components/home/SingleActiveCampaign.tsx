"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { getActiveSaleCampaigns } from "@/lib/services/sale-campaign-service";
import { SaleCampaign } from "@/types/sale-campaign";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { imageUrl } from "@/lib/utils/imageUrl";

function formatCampaignName(name: string) {
    return name.replace(/_/g, " ").toUpperCase();
}

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

    return (
        <section className="max-w-[1600px] w-full mx-auto px-6 md:px-12 my-16">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sunlight">
                {/* MARQUEE HEADER */}
                <div className="bg-signature-gradient text-white overflow-hidden py-3 flex relative">
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center font-labels font-bold uppercase tracking-widest text-xs">
                        {[...Array(12)].map((_, i) => (
                            <span key={"marquee-" + i} className="flex items-center gap-6">
                                <Zap className="size-3 fill-current" />
                                {formatCampaignName(campaign.name)}
                                <span className="text-white/30">///</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* LEFT: Campaign Info */}
                    <div className="p-8 md:p-12 lg:w-[480px] flex flex-col justify-between bg-surface-container-low relative overflow-hidden shrink-0">
                        {/* Subtle Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: "radial-gradient(circle, var(--foreground) 1px, transparent 1px)", backgroundSize: "12px 12px" }}
                        />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-surface-container-lowest rounded-lg shadow-sm">
                                <span className="size-2 bg-primary rounded-sm animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Siêu giảm giá</span>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl md:text-5xl font-semibold uppercase leading-[0.9] tracking-tighter text-foreground font-labels">
                                    {formatCampaignName(campaign.name)}
                                </h2>
                                {campaign.description && (
                                    <p className="text-sm text-foreground/50 leading-relaxed max-w-xs">
                                        {campaign.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 space-y-8 relative z-10">
                            <div className="space-y-4">
                                <div className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                                    Kết thúc sau
                                </div>
                                <div className="flex items-start gap-3 md:gap-4 font-labels font-bold text-4xl md:text-5xl tracking-tighter text-foreground">
                                    <div className="flex flex-col items-center">
                                        <span>{timeLeft.days}</span>
                                        <span className="text-[10px] tracking-widest text-foreground/30 mt-1 uppercase font-semibold">Ngày</span>
                                    </div>
                                    <span className="text-primary/30 pt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span>{timeLeft.hours}</span>
                                        <span className="text-[10px] tracking-widest text-foreground/30 mt-1 uppercase font-semibold">Giờ</span>
                                    </div>
                                    <span className="text-primary/30 pt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span>{timeLeft.minutes}</span>
                                        <span className="text-[10px] tracking-widest text-foreground/30 mt-1 uppercase font-semibold">Phút</span>
                                    </div>
                                    <span className="text-primary/30 pt-1">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-primary">{timeLeft.seconds}</span>
                                        <span className="text-[10px] tracking-widest text-primary/50 mt-1 uppercase font-semibold">Giây</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                                        Sản phẩm khuyến mãi
                                    </div>
                                    <div className="font-labels text-3xl font-bold text-foreground tracking-tighter">
                                        {campaign.totalItems.toString().padStart(2, '0')}+
                                    </div>
                                </div>

                                <Link
                                    href="/sale-campaigns"
                                    className="group flex items-center gap-3 text-xs font-bold text-primary hover:opacity-70 transition-all"
                                >
                                    Xem tất cả <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Product Items */}
                    <div className="flex-1 p-0 overflow-x-auto bg-surface-container-lowest scrollbar-hide">
                        <div className="grid grid-cols-2 lg:grid-cols-3 min-w-[750px] h-full">
                            {campaign.items.slice(0, 3).map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.productSlug}`}
                                    className="group relative p-8 md:p-10 flex flex-col justify-between h-full bg-surface-container-lowest transition-all duration-500"
                                >
                                    <div className="absolute top-6 right-6 z-10">
                                        <div className="bg-signature-gradient text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-sm">
                                            Giảm {item.discountPercent}%
                                        </div>
                                    </div>

                                    <div className="relative aspect-square mb-8 transition-all duration-500">
                                        {item.imageUrl && (
                                            <Image
                                                src={imageUrl.product(item.imageUrl)}
                                                alt={item.productName}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-contain p-4"
                                                unoptimized
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="h-px w-8 bg-primary/20 transition-all duration-700" />
                                        <div className="space-y-2">
                                            <h3 className="font-labels font-semibold text-sm line-clamp-2 min-h-[2.5em] text-foreground leading-relaxed">
                                                {item.productName}
                                            </h3>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-primary font-bold text-xl tracking-tight font-labels">
                                                    {formatCurrency(item.salePrice)}
                                                </span>
                                                <span className="text-xs font-medium text-foreground/30 line-through">
                                                    {formatCurrency(item.originalPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2 pt-3">
                                            <div className="flex justify-between text-[10px] font-semibold text-foreground/40">
                                                <span>Đã bán: {item.soldCount}</span>
                                                <span>Còn lại: {item.remainingStock}</span>
                                            </div>
                                            <div className="h-[3px] w-full bg-surface-container overflow-hidden rounded-sm">
                                                <div
                                                    className="h-full bg-signature-gradient transition-all duration-1000 block rounded-sm"
                                                    style={{ width: `${Math.max(5, (item.soldCount / item.stockLimit) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* Empty Slots */}
                            {campaign.items.length < 3 && Array.from({ length: 3 - campaign.items.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-surface-container-low flex items-center justify-center">
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
