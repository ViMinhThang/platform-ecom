"use client";

import { useCart } from "@/hooks/useCart";
import { SellerGroup } from "@/components/cart/SellerGroup";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CartRecommendations } from "@/components/recommendations/CartRecommendations";

import { usePromotion } from "@/hooks/usePromotion";

export default function CartPage() {
    const { cart, cartBySeller, loading } = useCart();
    usePromotion(cart);

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
                    <h1 className="text-2xl font-bold">Giỏ hàng của bạn đang trống</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Có vẻ như bạn chưa thêm gì vào giỏ hàng.
                        Hãy khám phá các sản phẩm của chúng tôi và tìm món đồ bạn yêu thích!
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/">Bắt đầu mua sắm</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-black mb-12 font-header tracking-tight text-zinc-900">
                Giỏ hàng <span className="text-primary/50 text-2xl font-bold ml-2">({cart.totalItems} sản phẩm)</span>
            </h1>

            <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
                <div className="space-y-2">
                    {cartBySeller.map((group) => (
                        <SellerGroup key={group.sellerId} group={group} />
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <CartSummary cart={cart} />
                </div>
            </div>

            <CartRecommendations />
        </div>
    );
}
