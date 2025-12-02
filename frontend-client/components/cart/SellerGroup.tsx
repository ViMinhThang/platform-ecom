"use client";

import { CartBySeller } from "@/types/cart.types";
import { CartItem } from "./CartItem";
import { Store } from "lucide-react";

interface SellerGroupProps {
    group: CartBySeller;
}

export function SellerGroup({ group }: SellerGroupProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm overflow-hidden mb-6">
            {/* Seller Header */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 border-b flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Sold by {group.sellerName}</span>
            </div>

            {/* Items List */}
            <div className="px-4">
                {group.items.map((item) => (
                    <CartItem key={`${item.productId}-${item.variantId || 'base'}`} item={item} />
                ))}
            </div>

            {/* Group Subtotal */}
            <div className="bg-zinc-50/50 dark:bg-zinc-800/30 px-4 py-3 border-t flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal ({group.items.length} items)</span>
                <span className="font-medium">${group.subtotal.toFixed(2)}</span>
            </div>
        </div>
    );
}
