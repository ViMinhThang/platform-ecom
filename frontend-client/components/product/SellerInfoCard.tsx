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
        <div className="bg-white border p-4 space-y-4 sticky top-24 shadow-sm">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Thông tin người bán
            </h3>

            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative flex-shrink-0">
                    {sellerImage ? (
                        <Image
                            src={imageUrl.avatar(sellerImage)}
                            alt={sellerName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-lg font-semibold">
                            {sellerName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-bold truncate text-sm uppercase tracking-tight">{sellerName}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ID: {sellerId}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ShoppingBag className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Đã bán</span>
                    </div>
                    <p className="font-bold text-sm tracking-tighter">
                        {new Intl.NumberFormat("en-US").format(totalSold)}+
                    </p>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Tham gia</span>
                    </div>
                    <p className="font-bold text-sm tracking-tighter">
                        {formatOrderDate(createdAt)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Link href={`/seller/${sellerId}`} className="block">
                    <Button variant="outline" size="sm" className="w-full gap-2 rounded-none border-zinc-900 border-2 font-black text-[10px] uppercase tracking-[0.2em] h-9 hover:bg-zinc-900 hover:text-white transition-all">
                        <Store className="w-3.5 h-3.5" />
                        Trang cửa hàng
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full gap-2 rounded-none font-black text-[10px] uppercase tracking-[0.2em] h-9 hover:bg-zinc-50">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat ngay
                </Button>
            </div>
        </div>
    );
}
