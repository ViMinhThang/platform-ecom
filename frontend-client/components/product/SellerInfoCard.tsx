'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, MessageCircle, ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatOrderDate } from "@/lib/utils/dateUtils";
import { getSellerInfo, SellerInfo } from "@/lib/services/user-service";

interface SellerInfoCardProps {
    sellerId: number;
    totalSold?: number;
    createdAt?: string;
}

export function SellerInfoCard({
    sellerId,
    totalSold = 0,
    createdAt
}: SellerInfoCardProps) {
    const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSellerInfo = async () => {
            if (!sellerId || sellerId === 0) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await getSellerInfo(sellerId);
                setSellerInfo(data);
            } catch (error) {
                console.error('Failed to fetch seller info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSellerInfo();
    }, [sellerId]);

    const sellerName = sellerInfo?.username || 'Unknown Seller';
    const sellerImage = sellerInfo?.imageUrl;

    if (isLoading) {
        return (
            <div className="border p-4 space-y-4 sticky top-24 animate-pulse">
                <div className="h-3 bg-muted rounded w-24"></div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-y py-4">
                    <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-16"></div>
                        <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-16"></div>
                        <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-9 bg-muted rounded"></div>
                    <div className="h-9 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-4 p-4 border border-border rounded-sm bg-background shadow-sm">
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative shrink-0 border border-border shadow-inner">
                {sellerImage ? (
                    <Image
                        src={imageUrl.avatar(sellerImage)}
                        alt={sellerName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                        {sellerName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-[11px] uppercase tracking-widest text-foreground">{sellerName}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5 opacity-50">Online vừa xong</p>
                    </div>
                    <Link href={`/seller/${sellerId}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 hover:text-primary rounded-sm transition-colors">
                            Xem Shop
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
                    <div className="flex gap-1 text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground opacity-60">Đánh giá:</span>
                        <span className="text-primary">4.9/5</span>
                    </div>
                    <div className="flex gap-1 text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground opacity-60">Sản phẩm:</span>
                        <span className="text-foreground">{totalSold || 150}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
