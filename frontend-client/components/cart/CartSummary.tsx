"use client";

import { Button } from "@/components/ui/button";
import { Cart } from "@/types/cart";

interface CartSummaryProps {
    cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
    return (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <Button className="w-full mt-6" size="lg">
                Checkout
            </Button>
        </div>
    );
}
