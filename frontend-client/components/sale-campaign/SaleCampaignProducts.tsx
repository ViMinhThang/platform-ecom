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
    const [saleCampaign, setSaleCampaign] = useState<SaleCampaign | null>(null);
    const [items, setItems] = useState<SaleCampaignItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaleCampaigns = async () => {
            try {
                const sales = await getActiveSaleCampaigns();
                if (sales.length > 0) {
                    const sale = sales[0];
                    setSaleCampaign(sale);

                    // Fetch items
                    const response = await getSaleCampaignItems(sale.slug, { size: 8 });
                    setItems(response.content);
                }
            } catch (error) {
                console.error('Failed to fetch sale campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleCampaigns();
    }, []);

    if (loading || !saleCampaign || items.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-zinc-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary text-white">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-wider">Sale Campaign</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">Kết thúc trong:</span>
                                <CountdownTimer endTime={saleCampaign.endTime} variant="inline" />
                            </div>
                        </div>
                    </div>
                    <Button asChild variant="outline" className="rounded-none border-2 border-black font-bold">
                        <Link href="/sale-campaigns">
                            Xem tất cả
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <SaleCampaignProductCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
