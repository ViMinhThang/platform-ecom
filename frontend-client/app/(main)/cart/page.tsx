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
                    <div className="h-8 bg-muted rounded-sm w-1/4 mx-auto"></div>
                    <div className="h-64 bg-muted/50 rounded-sm"></div>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto py-24 px-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="bg-muted/50 p-8 rounded-full shadow-inner">
                        <ShoppingBag className="h-12 w-12 text-primary/40" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">Giỏ hàng của bạn đang trống</h1>
                        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                            Có vẻ như bạn chưa thêm gì vào giỏ hàng.
                            Hãy khám phá các sản phẩm của chúng tôi và tìm món đồ bạn yêu thích!
                        </p>
                    </div>
                    <Button asChild className="mt-4 px-10 h-11 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md">
                        <Link href="/">Bắt đầu mua sắm</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 font-header">
            <h1 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-foreground uppercase tracking-widest">
                Giỏ hàng <span className="text-primary/50 text-xl font-bold ml-2">({cart.totalItems})</span>
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
