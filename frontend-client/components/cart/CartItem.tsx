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
        <div className="flex gap-6 py-6 border-b border-zinc-200 last:border-0 items-start">
            {/* Product Image */}
            <div className="relative h-28 w-28 shrink-0 bg-white border-2 border-black rounded-none overflow-hidden">
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
                            <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-none uppercase tracking-widest">
                                SẴN SÀNG
                            </span>
                        </div>

                        <h3 className="font-black text-sm uppercase md:text-base hover:underline cursor-pointer leading-snug tracking-tight">
                            {item.productName}
                        </h3>

                        {item.variantName && (
                            <p className="text-xs font-mono text-zinc-500 border-l-2 border-black pl-2">
                                PHIÊN BẢN: {item.variantName.toUpperCase()}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="font-mono font-bold text-lg tracking-tight">
                            {formatCurrency(item.price)}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono mt-1">
                            ĐƠN GIÁ
                        </p>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex flex-wrap items-end justify-between mt-4">
                    {/* Quantity Block */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider">SỐ LƯỢNG:</span>
                        <div className="flex items-center border-2 border-black rounded-none h-8 bg-white">
                            <button
                                className="px-2 h-full hover:bg-black hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors border-r-2 border-black"
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                disabled={item.quantity <= 1 || updating}
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-10 text-center text-sm font-mono font-bold tabular-nums h-full flex items-center justify-center">
                                {item.quantity}
                            </span>
                            <button
                                className="px-2 h-full hover:bg-black hover:text-white disabled:opacity-30 flex items-center justify-center transition-colors border-l-2 border-black"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={updating}
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                            <div className="font-black text-lg tracking-tighter text-[#FF4400] tabular-nums">
                                {formatCurrency(item.totalPrice)}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                TỔNG CỘNG
                            </p>
                        </div>

                        <button
                            className="bg-zinc-100 hover:bg-red-600 hover:text-white p-2 border-2 border-transparent hover:border-black transition-all"
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
