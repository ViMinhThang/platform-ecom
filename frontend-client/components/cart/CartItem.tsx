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
        <div className="flex gap-6 py-6 border-b last:border-0">
            {/* Product Image */}
            <div className="relative h-32 w-32 flex-shrink-0 bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden">
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
                    <div className="space-y-1">
                        {/* Status Badge Placeholder (eBay style) */}
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                SỐ LƯỢNG CÓ HẠN
                            </span>
                        </div>

                        <h3 className="font-bold text-sm md:text-base hover:underline cursor-pointer leading-snug">
                            {item.productName}
                        </h3>

                        {item.variantName && (
                            <p className="text-xs text-muted-foreground font-medium italic">
                                {item.variantName}
                            </p>
                        )}

                        <p className="text-[11px] text-muted-foreground mt-1">
                            Người bán cam kết chất lượng sản phẩm
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="font-black text-lg tracking-tighter">
                            {formatCurrency(item.price)}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                            {formatCurrency(item.totalPrice)} Tổng
                        </p>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex flex-wrap items-center gap-6 mt-6">
                    {/* Quantity Block */}
                    <div className="flex items-center border-2 border-zinc-200 rounded-md h-9">
                        <button
                            className="px-3 h-full hover:bg-zinc-50 disabled:opacity-30 flex items-center justify-center transition-colors"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating}
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-black tabular-nums border-x-2 border-zinc-200 h-full flex items-center justify-center">
                            {item.quantity}
                        </span>
                        <button
                            className="px-3 h-full hover:bg-zinc-50 disabled:opacity-30 flex items-center justify-center transition-colors"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={updating}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors hover:underline underline-offset-4"
                        >
                            Lưu lại
                        </button>
                        <div className="w-px h-3 bg-zinc-200" />
                        <button
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors hover:underline underline-offset-4 disabled:opacity-50"
                            onClick={handleRemove}
                            disabled={updating}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
