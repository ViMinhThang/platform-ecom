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
        <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-zinc-50/30">
                <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-zinc-400" />
                    <span className="font-bold text-sm tracking-tight hover:underline cursor-pointer">
                        {sellerName}
                    </span>
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
