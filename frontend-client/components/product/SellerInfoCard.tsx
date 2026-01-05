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
        <div className="bg-white border-2 border-black p-4 space-y-4 sticky top-24">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-black"></span>
                NHÀ CUNG CẤP // VENDOR_PROFILE
            </h3>

            <div className="flex items-center gap-4 py-2">
                <div className="w-14 h-14 border-2 border-black bg-zinc-100 overflow-hidden relative shrink-0">
                    {sellerImage ? (
                        <Image
                            src={imageUrl.avatar(sellerImage)}
                            alt={sellerName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-white text-lg font-black">
                            {sellerName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-black truncate text-sm uppercase tracking-tight text-black">{sellerName}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">AUTH_ID: {sellerId}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-black border-2 border-black">
                <div className="bg-white p-3">
                    <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">ĐÃ BÁN</span>
                    </div>
                    <p className="font-mono font-black text-sm text-black">
                        {new Intl.NumberFormat("en-US").format(totalSold)}+
                    </p>
                </div>
                <div className="bg-white p-3">
                    <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">THAM GIA</span>
                    </div>
                    <p className="font-mono font-black text-sm text-black">
                        {formatOrderDate(createdAt)}
                    </p>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <Link href={`/seller/${sellerId}`} className="block">
                    <Button variant="outline" size="sm" className="w-full gap-2 rounded-none border-black border-2 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] h-10 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                        <Store className="w-3.5 h-3.5" />
                        XEM GIAN HÀNG
                    </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full gap-2 rounded-none font-black text-[10px] uppercase tracking-[0.2em] h-10 hover:bg-zinc-100 text-zinc-500 hover:text-black">
                    <MessageCircle className="w-3.5 h-3.5" />
                    LIÊN HỆ TRỰC TIẾP
                </Button>
            </div>
        </div>
    );
}
