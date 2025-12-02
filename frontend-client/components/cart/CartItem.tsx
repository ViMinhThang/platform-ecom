"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartProduct } from "@/types/cart";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
    item: CartProduct;
    onUpdateQuantity: (productId: number, variantId: number | undefined, change: number) => void;
    onRemove: (productId: number, variantId: number | undefined) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    // Determine image to show: variant specific or first product image
    // Backend ProductDTO doesn't explicitly send variant image, but we could have added it.
    // For now, use first product image.
    const imageUrl = item.images && item.images.length > 0
        ? `http://localhost:8080/uploads/products/${item.images[0].imageUrl}`
        : "https://placehold.co/100x100";

    return (
        <div className="flex gap-4 py-4 border-b">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-zinc-100">
                <Image
                    src={imageUrl}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-center"
                    unoptimized
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium">
                        <h3 className="line-clamp-2 pr-4">
                            <a href={`/products/${item.id}`}>{item.name}</a>
                        </h3>
                        <p className="ml-4 whitespace-nowrap">
                            ${(item.minPrice || 0).toFixed(2)}
                        </p>
                    </div>

                    {item.sellerName && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <Store className="w-3 h-3" />
                            <span>{item.sellerName}</span>
                        </div>
                    )}

                    {item.variantSku && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Variant: {item.variantSku}
                        </p>
                    )}
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.variantId, -1)}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.variantId, 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onRemove(item.id, item.variantId)}
                    >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                    </Button>
                </div>
            </div>
        </div>
    );
}
