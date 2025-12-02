"use client";

import { useCart } from "@/hooks/useCart";
import { SellerGroup } from "@/components/cart/SellerGroup";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    const { cart, cartBySeller, loading } = useCart();

    if (loading && !cart) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-zinc-200 rounded w-1/4 mx-auto"></div>
                    <div className="h-64 bg-zinc-100 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto py-24 px-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-zinc-100 p-6 rounded-full">
                        <ShoppingBag className="h-12 w-12 text-zinc-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Your cart is empty</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Looks like you haven't added anything to your cart yet.
                        Explore our products and find something you love!
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cart.totalItems} items)</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items Column */}
                <div className="lg:col-span-2">
                    {cartBySeller.map((group) => (
                        <SellerGroup key={group.sellerId} group={group} />
                    ))}
                </div>

                {/* Summary Column */}
                <div className="lg:col-span-1">
                    <CartSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}
