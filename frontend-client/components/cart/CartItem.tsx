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
        <div className="bg-surface-container-lowest p-6 rounded-xl flex gap-6 items-center">
            {/* Product Image: Magazine Style */}
            <div className="w-32 h-40 bg-surface-container rounded-lg overflow-hidden shrink-0">

                <Image
                    src={imageUrl.product(item.imageUrl)}
                    alt={item.productName}
                    width={128}
                    height={160}
                    className="w-full h-full object-cover"
                    unoptimized
                />
            </div>

            {/* Content & Layout */}
            <div className="grow flex flex-col gap-2">

                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">SỰ LỰA CHỌN MỚI</span>
                        <h3 className="text-xl font-bold font-headline leading-tight">{item.productName}</h3>
                        <p className="text-sm text-on-surface-variant">
                            {item.variantName && <span>Loại: {item.variantName}</span>}
                            {item.variantName && <span className="mx-2">|</span>}
                            <span>Màu sắc: Tự nhiên</span>
                        </p>
                    </div>
                    <span className="text-xl font-bold text-on-surface">{formatCurrency(item.totalPrice)}</span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    {/* Quantity Controls: Editorial Style */}
                    <div className="flex items-center bg-surface-container-low rounded-xl px-2 py-1 border border-border">
                        <button 
                            className="p-1 hover:text-primary transition-colors disabled:opacity-20"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating}
                        >
                            <Minus className="h-4 w-4" strokeWidth={3} />
                        </button>
                        <span className="px-4 font-bold text-on-surface text-sm">{item.quantity}</span>
                        <button 
                            className="p-1 hover:text-primary transition-colors disabled:opacity-20"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={updating}
                        >
                            <Plus className="h-4 w-4" strokeWidth={3} />
                        </button>
                    </div>

                    <button 
                        className="flex items-center gap-1 text-sm font-medium text-on-surface-variant hover:text-destructive transition-colors group"
                        onClick={handleRemove}
                        disabled={updating}
                    >
                        <X className="h-4 w-4 text-on-surface-variant/40 group-hover:text-destructive transition-colors" strokeWidth={3} />
                        <span>Gỡ bỏ</span>
                    </button>
                </div>
            </div>
        </div>
    );

}
