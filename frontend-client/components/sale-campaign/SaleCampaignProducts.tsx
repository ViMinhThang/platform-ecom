'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from './CountdownTimer';
import { SaleCampaignProductCard } from './SaleCampaignProductCard';
import { SaleCampaign, SaleCampaignItem } from '@/types/sale-campaign';
import { getActiveSaleCampaigns, getSaleCampaignItems } from '@/lib/services/sale-campaign-service';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export function SaleCampaignProducts() {
    const [data, setData] = useState<{ campaign: SaleCampaign | null; items: SaleCampaignItem[] }>({ campaign: null, items: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaleCampaigns = async () => {
            try {
                const sales = await getActiveSaleCampaigns();
                if (sales.length > 0) {
                    const sale = sales[0];

                    const response = await getSaleCampaignItems(sale.slug, { size: 8 });
                    setData({ campaign: sale, items: response.content });
                }
            } catch (error) {
                console.error('Failed to fetch sale campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleCampaigns();
    }, []);

    if (loading || !data.campaign || data.items.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-muted/30 border-y border-border shadow-inner">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/20 border border-primary/30 rounded-sm shadow-md shadow-primary/10">
                            <Zap className="size-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold uppercase tracking-widest text-foreground">Chiến dịch khuyến mãi</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">Kết thúc trong:</span>
                                <CountdownTimer endTime={data.campaign.endTime} variant="inline" />
                            </div>
                        </div>
                    </div>
                    <Button asChild variant="outline" className="rounded-sm border-border shadow-sm font-bold uppercase tracking-widest text-[10px] h-10 hover:bg-primary/5 hover:border-primary/30 transition-all">
                        <Link href="/sale-campaigns">
                            Xem tất cả
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.items.map((item) => (
                        <SaleCampaignProductCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
