"use client";

import { CartItemDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

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
        <div className="flex gap-4 py-4 border-b last:border-0">
            {/* Product Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-zinc-100">
                <Image
                    src={`http://localhost:8080/uploads/products/${item.imageUrl}`}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="grid gap-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    {item.variantName && (
                        <p className="text-sm text-muted-foreground">Variant: {item.variantName}</p>
                    )}
                    <p className="text-sm font-medium text-blue-600">
                        ${item.price.toFixed(2)}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={updating}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleRemove}
                        disabled={updating}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                    </Button>
                </div>
            </div>

            {/* Item Total */}
            <div className="text-right font-medium">
                ${item.totalPrice.toFixed(2)}
            </div>
        </div>
    );
}
