"use client";

import { useState, useEffect } from "react";
import { CartBySeller } from "@/types/cart.types";
import { CartItem } from "./CartItem";
import { Store, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSellerInfo, SellerInfo } from "@/lib/services/user-service";
import { imageUrl } from "@/lib/utils/imageUrl";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface SellerGroupProps {
    group: CartBySeller;
}

export function SellerGroup({ group }: SellerGroupProps) {
    const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const info = await getSellerInfo(group.sellerId);
                setSellerInfo(info);
            } catch (error) {
                console.error("Failed to fetch seller info:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeller();
    }, [group.sellerId]);

    const sellerName = sellerInfo?.username || group.sellerName || "Người bán";

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm overflow-hidden mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    ) : (
                        <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage src={imageUrl.avatar(sellerInfo?.imageUrl)} />
                            <AvatarFallback className="text-[10px] font-bold">
                                {sellerName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase tracking-tight leading-none mb-1">Bán bởi</span>
                        <div className="flex items-center gap-1.5">
                            <Store className="h-3 w-3 text-primary" />
                            <span className="font-black text-[10px] uppercase tracking-wider text-foreground">
                                {sellerName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4">
                {group.items.map((item) => (
                    <CartItem key={`${item.productId}-${item.variantId || 'base'}`} item={item} />
                ))}
            </div>

            <div className="bg-zinc-50/50 dark:bg-zinc-800/30 px-4 py-4 border-t flex justify-between items-center group/total hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Tạm tính ({group.items.length} sản phẩm)
                </span>
                <span className="font-black text-lg tracking-tighter text-primary">
                    {formatCurrency(group.subtotal)}
                </span>
            </div>
        </div>
    );
}
