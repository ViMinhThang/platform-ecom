"use client";

import { CartBySeller } from "@/types/cart.types";
import { CartItem } from "./CartItem";
import { useGetSellerInfoQuery } from "@/lib/store/api/clientApi";

interface SellerGroupProps {
    group: CartBySeller;
}

export function SellerGroup({ group }: SellerGroupProps) {
    const { data: sellerInfo, isLoading } = useGetSellerInfoQuery(group.sellerId, {
        skip: !group.sellerId
    });

    const sellerName = sellerInfo?.username || group.sellerName || "Đang tải...";

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] font-labels">
                        <span className="text-foreground/40">Người bán:</span>
                        <h3 className="text-foreground uppercase tracking-widest transition-all">
                            {isLoading ? (
                                <span className="animate-pulse opacity-20">ĐANG_XÁC_THỰC</span>
                            ) : (
                                sellerName
                            )}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                    <span className="text-[9px] font-bold text-primary tracking-[0.3em] uppercase font-labels">Đã xác minh</span>
                </div>
            </div>

            <div className="space-y-12 pt-8">
                {group.items.map((item) => (
                    <CartItem key={`${item.productId}-${item.variantId || 'base'}`} item={item} />
                ))}
            </div>
        </div>
    );
}
