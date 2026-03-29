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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8 px-6">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-labels italic text-foreground/40 animate-pulse tracking-widest text-xs">Đang kiểm tra giỏ hàng...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-background py-32 px-6 flex items-center justify-center">
                <div className="max-w-md w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="relative w-24 h-24 mx-auto">
                        <ShoppingBag className="w-full h-full text-foreground/5 shadow-inner" strokeWidth={1} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-sm" />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="font-labels text-3xl font-bold tracking-tight uppercase">Giỏ hàng của bạn hiện đang trống</h1>
                        <p className="text-sm leading-relaxed text-foreground/50 font-bold uppercase tracking-wider font-labels">
                            Hệ thống hiện chưa ghi nhận sản phẩm nào. 
                            Vui lòng tiếp tục mua sắm để khám phá thêm.
                        </p>
                    </div>

                    <Button asChild className="group bg-primary text-white hover:bg-primary/95 px-16 h-14 rounded-sm transition-all shadow-xl">
                        <Link href="/" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                            Tiếp tục mua sắm
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen pb-32">
            {/* STICKY HEADER FOR CART: Transparent Editorial Style */}
            <div className="bg-background/90 backdrop-blur-md sticky top-[72px] z-30 transition-all border-b border-foreground/5">
                <div className="container max-w-[1600px] mx-auto px-12 py-8">
                    <h1 className="font-labels text-4xl font-bold tracking-tighter uppercase text-foreground">
                        Giỏ hàng của bạn <span className="text-foreground/20 text-sm font-bold align-middle ml-6 tracking-widest font-labels">({cart.totalItems} SẢN PHẨM)</span>
                    </h1>
                </div>
            </div>

            <div className="container max-w-[1600px] mx-auto px-12 py-20">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* LEFT: CART ITEMS LIST */}
                    <div className="lg:col-span-8 space-y-16">
                        {cartBySeller.map((group) => (
                            <SellerGroup key={group.sellerId} group={group} />
                        ))}
                    </div>

                    {/* RIGHT: SUMMARY CARD */}
                    <div className="lg:col-span-4 sticky top-[180px]">
                        <div className="bg-white p-10 rounded-[4px] border border-foreground/5">
                            <CartSummary cart={cart} />
                        </div>
                    </div>
                </div>

                {/* BOTTOM: RECOMMENDATIONS */}
                <div className="mt-48 pt-32 border-t border-foreground/5">
                    <div className="space-y-20">
                        <div className="text-center space-y-4">
                            <h2 className="font-labels text-4xl font-bold uppercase tracking-tight text-foreground/80">Có thể bạn quan tâm</h2>
                            <div className="h-px bg-primary/10 w-24 mx-auto" />
                        </div>
                        <CartRecommendations />
                    </div>
                </div>
            </div>
        </div>
    );
}
