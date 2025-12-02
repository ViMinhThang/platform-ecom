"use client";

import { CartDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface CartSummaryProps {
    cart: CartDTO;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                </div>

                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => router.push("/checkout")}
            >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-md">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure Checkout with Stripe</span>
            </div>
        </div>
    );
}
