'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowLeft } from 'lucide-react';
import { FlashSale, FlashSaleItem } from '@/types/flash-sale';
import { CountdownTimer } from '@/components/flash-sale';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { imageUrl } from '@/lib/utils/imageUrl';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface FlashSaleDetailClientProps {
    flashSale: FlashSale;
    items: FlashSaleItem[];
}

export function FlashSaleDetailClient({ flashSale, items }: FlashSaleDetailClientProps) {
    return (
        <div>
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black border-b-4 border-primary">
                {flashSale.bannerUrl && (
                    <div className="absolute inset-0 opacity-30">
                        <Image
                            src={flashSale.bannerUrl}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="relative container mx-auto px-4 py-12">
                    <Button asChild variant="outline" size="sm" className="mb-6 rounded-none border-white text-white hover:bg-white hover:text-black">
                        <Link href="/flash-sales">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tất cả Flash Sales
                        </Link>
                    </Button>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary animate-pulse">
                                <Zap className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
                                    {flashSale.name}
                                </h1>
                                {flashSale.description && (
                                    <p className="text-white/70 mt-2 max-w-xl">{flashSale.description}</p>
                                )}
                                <div className="text-white/50 text-sm mt-2">
                                    {items.length} sản phẩm đang giảm giá
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                Kết thúc trong
                            </div>
                            <CountdownTimer endTime={flashSale.endTime} variant="banner" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8">
                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">Không có sản phẩm nào trong chương trình này</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item) => (
                            <Link key={item.id} href={`/products/${item.productSlug}`}>
                                <Card className="p-0 border-2 border-black rounded-none bg-white h-full flex flex-col transition-all hover:bg-black group overflow-hidden">
                                    <CardContent className="p-0 relative aspect-square bg-zinc-100 overflow-hidden border-b-2 border-black">
                                        {/* Discount Badge */}
                                        <Badge className="absolute top-0 left-0 z-10 bg-primary text-white rounded-none px-2 py-1 text-[10px] font-black tracking-widest">
                                            -{item.discountPercent}%
                                        </Badge>

                                        {/* Flash Badge */}
                                        <Badge className="absolute top-0 right-0 z-10 bg-black text-white rounded-none px-2 py-1 text-[8px] font-black tracking-widest flex items-center gap-1">
                                            <Zap className="h-3 w-3" />
                                            FLASH
                                        </Badge>

                                        {/* Out of stock overlay */}
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
                                        <h3 className="font-black text-[10px] uppercase tracking-widest leading-tight line-clamp-2 text-black group-hover:text-white transition-colors h-8">
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
                                                        style={{ width: `${Math.min((item.soldCount / item.stockLimit) * 100, 100)}%` }}
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
                )}
            </div>
        </div>
    );
}
