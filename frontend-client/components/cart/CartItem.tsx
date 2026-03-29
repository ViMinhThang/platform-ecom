"use client";

import { CartItemDTO } from "@/types/cart.types";
import { Plus, Minus, X } from 'lucide-react';
import { imageUrl } from '@/lib/utils/imageUrl';
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface CartItemProps {
    item: CartItemDTO;
}

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
        <div className="flex gap-8 p-8 bg-white rounded-[4px] border border-foreground/5 items-start group shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] animate-in fade-in duration-700">
            {/* Product Image: Sharp, Ghost Border */}
            <div className="relative h-32 w-24 shrink-0 bg-secondary/50 border border-foreground/5 overflow-hidden">
                <Image
                    src={imageUrl.product(item.imageUrl)}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            {/* Content & Controls */}
            <div className="flex flex-1 flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start gap-8">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 font-labels">Nhật ký vật phẩm sẵn sàng vận chuyển</span>
                            <h3 className="font-labels font-bold text-[13px] uppercase tracking-wider leading-tight max-w-md group-hover:text-primary transition-all">
                                {item.productName}
                            </h3>
                        </div>

                        {item.variantName && (
                             <div className="inline-block px-3 py-1 bg-[#F5F3F4] rounded-sm">
                                <p className="text-[9px] font-bold text-foreground/40 font-labels uppercase tracking-widest">
                                    Loại: {item.variantName}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-right space-y-1">
                        <div className="font-labels font-bold text-lg text-foreground tracking-tight">
                            {formatCurrency(item.price)}
                        </div>
                        <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Đơn giá</p>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-10">
                        {/* Quantity Selector: Minimal */}
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 font-labels">Số lượng</span>
                            <div className="flex items-center border border-foreground/10 h-9 rounded-sm overflow-hidden bg-white">
                                <button
                                    className="w-9 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-20"
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    disabled={item.quantity <= 1 || updating}
                                >
                                    <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-9 text-center text-xs font-bold tabular-nums">
                                    {item.quantity}
                                </span>
                                <button
                                    className="w-9 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-20"
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    disabled={updating}
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        {/* Remove Action: Minimal */}
                        <button
                            className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/20 hover:text-red-500 transition-colors flex items-center gap-2 group/remove"
                            onClick={handleRemove}
                            disabled={updating}
                        >
                            <X className="h-3 w-3 text-foreground/10 group-hover/remove:text-red-400 transition-colors" />
                            Gỡ hồ sơ
                        </button>
                    </div>

                    <div className="text-right">
                        <div className="font-labels font-bold text-xl text-primary tracking-tight">
                            {formatCurrency(item.totalPrice)}
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/40">Thành tiền</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
