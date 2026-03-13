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

    const sellerName = sellerInfo?.username || group.sellerName || "NGƯỜI BÁN";

    return (
        <div className="bg-background border border-border rounded-sm mb-8 shadow-md overflow-hidden font-header">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-sm text-primary">
                        <Store className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[11px] tracking-[0.2em] uppercase hover:text-primary transition-colors cursor-pointer text-foreground">
                        {sellerName}
                    </span>
                    <span className="text-[8px] font-bold text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-sm tracking-widest uppercase">VERIFIED</span>
                </div>
            </div>

            <div className="px-6">
                {group.items.map((item) => (
                    <CartItem key={`${item.productId}-${item.variantId || 'base'}`} item={item} />
                ))}
            </div>
        </div>
    );
}
