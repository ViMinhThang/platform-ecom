'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from './CountdownTimer';
import { FlashSale, FlashSaleItem } from '@/types/flash-sale';
import { getActiveFlashSales, getFlashSaleItems } from '@/lib/services/flash-sale-service';
import { imageUrl } from '@/lib/utils/imageUrl';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export function FlashSaleProducts() {
    const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
    const [items, setItems] = useState<FlashSaleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const sales = await getActiveFlashSales();
                if (sales.length > 0) {
                    const sale = sales[0];
                    setFlashSale(sale);

                    // Fetch items
                    const saleItems = await getFlashSaleItems(sale.slug, 8);
                    setItems(saleItems);
                }
            } catch (error) {
                console.error('Failed to fetch flash sales:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSales();
    }, []);

    if (loading || !flashSale || items.length === 0) {
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
                            <h2 className="text-2xl font-black uppercase tracking-wider">Flash Sale</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">Kết thúc trong:</span>
                                <CountdownTimer endTime={flashSale.endTime} variant="inline" />
                            </div>
                        </div>
                    </div>
                    <Button asChild variant="outline" className="rounded-none border-2 border-black font-bold">
                        <Link href={`/flash-sales/${flashSale.slug}`}>
                            Xem tất cả
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <Link key={item.id} href={`/products/${item.productSlug}`}>
                            <Card className="p-0 border-2 border-black rounded-none bg-white h-full flex flex-col transition-all hover:bg-black group overflow-hidden">
                                <CardContent className="p-0 relative aspect-square bg-zinc-100 overflow-hidden border-b-2 border-black">
                                    {/* Discount Badge */}
                                    <Badge className="absolute top-0 left-0 z-10 bg-primary text-white rounded-none px-2 py-1 text-[10px] font-black tracking-widest">
                                        -{item.discountPercent}%
                                    </Badge>

                                    {/* Flash Sale Badge */}
                                    <Badge className="absolute top-0 right-0 z-10 bg-black text-white rounded-none px-2 py-1 text-[8px] font-black tracking-widest flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        FLASH
                                    </Badge>

                                    {/* Stock indicator */}
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center">
                                            <span className="text-[10px] font-black px-4 py-2 border-2 border-black text-black uppercase tracking-widest">
                                                Hết hàng
                                            </span>
                                        </div>
                                    )}

                                    <Image
                                        src={imageUrl.product(item.imageUrl || '')}
                                        alt={item.productName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </CardContent>

                                <CardFooter className="flex flex-col items-start p-4 space-y-3 grow bg-white group-hover:bg-black transition-colors">
                                    <h3 className="font-black text-[10px] uppercase tracking-widest leading-tight line-clamp-2 text-black group-hover:text-white transition-colors">
                                        {item.productName}
                                    </h3>

                                    <div className="w-full">
                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 font-mono mb-2">
                                            <span className="text-lg font-black tracking-tighter text-primary">
                                                {formatCurrency(item.flashSalePrice)}
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-400 line-through">
                                                {formatCurrency(item.originalPrice)}
                                            </span>
                                        </div>

                                        {/* Stock progress */}
                                        <div className="space-y-1">
                                            <div className="h-1.5 bg-zinc-200 group-hover:bg-zinc-700 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${(item.soldCount / item.stockLimit) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400">
                                                <span>Đã bán: {item.soldCount}</span>
                                                <span>Còn: {item.remainingStock}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
