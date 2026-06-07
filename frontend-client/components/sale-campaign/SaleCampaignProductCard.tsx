'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShoppingCart, Loader2 } from 'lucide-react';
import { SaleCampaignItem } from '@/types/sale-campaign';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { imageUrl } from '@/lib/utils/imageUrl';

import { useAddToCartMutation } from '@/lib/store/api/clientApi';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface SaleCampaignProductCardProps {
    item: SaleCampaignItem;
}

export function SaleCampaignProductCard({ item }: SaleCampaignProductCardProps) {
    const [addToCartMutation] = useAddToCartMutation();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!item.isAvailable) return;

        setIsAdding(true);
        try {
            await addToCartMutation({
                productId: item.productId,
                variantId: item.variantId,
                quantity: 1
            }).unwrap();
            toast.success('Đã thêm vào giỏ hàng');
        } catch (error) {
            toast.error('Không thể thêm vào giỏ hàng');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Card className="p-0 border border-border rounded-sm bg-background h-full flex flex-col transition-all group overflow-hidden relative shadow-sm hover:shadow-md">
            <div className="relative">
                {/* Link covering the image area */}
                <Link href={`/products/${item.productSlug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Xem {item.productName}</span>
                </Link>

                <CardContent className="p-0 relative aspect-square bg-muted/30 overflow-hidden border-b border-border">
                    {/* Discount Badge */}
                    <Badge className="absolute top-0 left-0 z-10 bg-primary text-primary-foreground rounded-sm px-2 py-1 text-[10px] font-bold tracking-widest pointer-events-none">
                        -{item.discountPercent}%
                    </Badge>

                    {/* Sale Badge */}
                    <Badge className="absolute top-0 right-0 z-10 bg-foreground/10 backdrop-blur-sm text-foreground rounded-sm px-2 py-1 text-[8px] font-bold tracking-widest flex items-center gap-1 pointer-events-none">
                        <Zap className="size-3 fill-primary text-primary" />
                        GIẢM GIÁ
                    </Badge>

                    {/* Lớp phủ hết hàng */}
                    {!item.isAvailable && (
                        <div className="absolute inset-0 bg-background/80 z-20 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-bold px-4 py-2 border border-border bg-background text-foreground uppercase tracking-widest shadow-sm">
                                Hết hàng
                            </span>
                        </div>
                    )}

                    <Image
                        src={imageUrl.product(item.imageUrl)}
                        alt={item.productName}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </CardContent>

                {/* Nút thêm vào giỏ hàng */}
                {item.isAvailable && (
                    <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            size="icon"
                            variant="default"
                            className="rounded-full size-10 bg-primary hover:bg-primary/90 text-white shadow-lg"
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            aria-label="Thêm vào giỏ hàng"
                        >
                            {isAdding ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <ShoppingCart className="size-4" />
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <Link href={`/products/${item.productSlug}`} className="grow flex flex-col">
                <CardFooter className="flex flex-col items-start p-4 gap-y-3 grow bg-background transition-colors">
                    <h3 className="font-semibold text-[10px] uppercase tracking-widest leading-tight line-clamp-2 text-foreground transition-colors h-8 w-full">
                        {item.productName}
                    </h3>

                    <div className="w-full">
                        {/* Price */}
                        <div className="flex items-baseline gap-2 font-header mb-2">
                            <span className="text-lg font-bold tracking-tighter text-primary">
                                {formatCurrency(item.salePrice)}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground line-through">
                                {formatCurrency(item.originalPrice)}
                            </span>
                        </div>

                        {/* Stock progress */}
                        <div className="space-y-1">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden border border-border">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${Math.min((item.soldCount / item.stockLimit) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Đã bán: {item.soldCount}</span>
                                <span>Còn: {item.remainingStock}</span>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}
