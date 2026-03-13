"use client";

import { CartItemDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from 'lucide-react';
import { imageUrl } from '@/lib/utils/imageUrl';
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface CartItemProps {
    item: CartItemDTO;
}

import { formatCurrency } from "@/lib/utils/formatCurrency";

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();
    const [updating, setUpdating] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdating(true);
        try {
            await updateQuantity(item.productId, item.variantId, newQuantity - item.quantity);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemove = async () => {
        setUpdating(true);
        try {
            await removeItem(item.productId, item.variantId);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="flex gap-6 py-6 border-b border-border last:border-0 items-start font-header">
            {/* Product Image */}
            <div className="relative h-28 w-28 shrink-0 bg-background border border-border rounded-sm overflow-hidden shadow-sm">
                <Image
                    src={imageUrl.product(item.imageUrl)}
                    alt={item.productName}
                    fill
                    className="object-contain p-2"
                    unoptimized
                />
            </div>

            {/* Product Details & Actions */}
            <div className="flex flex-1 flex-col">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-sm uppercase tracking-widest">
                                SẴN SÀNG
                            </span>
                        </div>

                        <h3 className="font-bold text-sm uppercase md:text-base hover:text-primary transition-colors cursor-pointer leading-snug tracking-widest">
                            {item.productName}
                        </h3>

                        {item.variantName && (
                            <p className="text-[10px] font-bold text-muted-foreground border-l-2 border-primary/30 pl-2 uppercase tracking-widest">
                                {item.variantName}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="font-bold text-base tracking-tighter text-foreground">
                            {formatCurrency(item.price)}
                        </div>
                        <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase opacity-50">
                            ĐƠN GIÁ
                        </p>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex flex-wrap items-end justify-between mt-4">
                    {/* Quantity Block */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SỐ LƯỢNG:</span>
                        <div className="flex items-center border border-border rounded-sm h-8 bg-background shadow-sm overflow-hidden">
                            <button
                                className="px-2 h-full hover:bg-muted/50 disabled:opacity-30 flex items-center justify-center transition-colors border-r border-border"
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                disabled={item.quantity <= 1 || updating}
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-10 text-center text-xs font-bold tabular-nums h-full flex items-center justify-center text-foreground">
                                {item.quantity}
                            </span>
                            <button
                                className="px-2 h-full hover:bg-muted/50 disabled:opacity-30 flex items-center justify-center transition-colors border-l border-border"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={updating}
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                            <div className="font-bold text-lg tracking-tighter text-primary tabular-nums">
                                {formatCurrency(item.totalPrice)}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                                TỔNG CỘNG
                            </p>
                        </div>

                        <button
                            className="bg-muted/50 hover:bg-red-500 hover:text-white p-2 border border-transparent rounded-sm transition-all shadow-sm"
                            onClick={handleRemove}
                            disabled={updating}
                            title="Xóa sản phẩm"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
