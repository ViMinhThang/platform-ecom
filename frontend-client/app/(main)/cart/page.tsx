"use client";

import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CartRecommendations } from "@/components/recommendations/CartRecommendations";
import { usePromotion } from "@/hooks/usePromotion";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function CartPage() {
    const { cart, cartBySeller, loading } = useCart();
    usePromotion(cart);

    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6 px-6">
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-foreground/50 animate-pulse">Đang tải giỏ hàng...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-background py-32 px-6 flex items-center justify-center">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="relative w-20 h-20 mx-auto">
                        <ShoppingBag className="w-full h-full text-foreground/10" strokeWidth={1} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h1 className="font-labels text-2xl font-bold tracking-tight">Giỏ hàng trống</h1>
                        <p className="text-sm text-foreground/50 leading-relaxed">
                            Bạn chưa thêm sản phẩm nào. Hãy khám phá những sản phẩm tuyệt vời đang chờ bạn.
                        </p>
                    </div>

                    <Button asChild size="lg">
                        <Link href="/">
                            Tiếp tục mua sắm
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen pb-48">
            <div className="max-w-screen-2xl mx-auto px-6 py-12">

                {/* Cart Header: Editorial Style */}
                <div className="mb-12 md:mb-16 space-y-2">
                    <h1 className="font-header text-5xl md:text-6xl font-black tracking-tight text-foreground">
                        Giỏ hàng
                    </h1>
                    <p className="text-on-surface-variant font-medium">
                        Xem lại các lựa chọn đã tuyển chọn của bạn trước khi thanh toán.
                    </p>
                </div>


                <div className="grid lg:grid-cols-12 gap-12 md:gap-16 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {cart.items.map((item) => (
                            <CartItem key={`${item.productId}-${item.variantId || 'base'}`} item={item} />
                        ))}


                        {/* Free Shipping Trust Banner */}
                        <div className="mt-8 flex items-center justify-between p-6 bg-surface-container rounded-xl">
                            <div className="flex items-center gap-4">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                <p className="text-sm font-medium">Bạn đủ điều kiện nhận <span className="font-bold">Giao hàng Hỏa tốc Miễn phí</span></p>
                            </div>
                            <Link href="/" className="text-sm font-bold text-primary underline decoration-2 underline-offset-4">
                                Tiếp tục mua sắm
                            </Link>
                        </div>

                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4 sticky top-28">
                        <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-border">
                            <CartSummary cart={cart} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
