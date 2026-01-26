'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from './CountdownTimer';
import { SaleCampaign } from '@/types/sale-campaign';
import { getActiveSaleCampaigns } from '@/lib/services/sale-campaign-service';

export function SaleCampaignBanner() {
    const [saleCampaign, setSaleCampaign] = useState<SaleCampaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaleCampaigns = async () => {
            try {
                const sales = await getActiveSaleCampaigns();
                if (sales.length > 0) {
                    setSaleCampaign(sales[0]); // Show the first active sale campaign
                }
            } catch (error) {
                console.error('Failed to fetch sale campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleCampaigns();
    }, []);

    if (loading || !saleCampaign) {
        return null;
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-black via-zinc-900 to-black border-y-4 border-primary">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.03) 10px,
            rgba(255,255,255,0.03) 20px
          )`
                }} />
            </div>

            {/* Banner Image (if exists) */}
            {saleCampaign.bannerUrl && (
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src={saleCampaign.bannerUrl}
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="relative container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Left side - Title and description */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary animate-pulse">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                                    {saleCampaign.name}
                                </h2>
                                <span className="px-2 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    Live Now
                                </span>
                            </div>
                            {saleCampaign.description && (
                                <p className="text-white/70 text-sm mt-1 max-w-md">
                                    {saleCampaign.description}
                                </p>
                            )}
                            <div className="text-white/50 text-xs mt-2 font-mono">
                                {saleCampaign.totalItems} sản phẩm đang giảm giá
                            </div>
                        </div>
                    </div>

                    {/* Center - Countdown */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-white/50 text-xs uppercase tracking-widest font-bold">
                            Kết thúc trong
                        </div>
                        <CountdownTimer endTime={saleCampaign.endTime} variant="banner" />
                    </div>

                    {/* Right side - CTA */}
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white rounded-none font-black uppercase tracking-wider px-8 group"
                    >
                        <Link href="/sale-campaigns">
                            Xem ngay
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
