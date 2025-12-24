"use client";

import { CartDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface CartSummaryProps {
    cart: CartDTO;
}

import { formatCurrency } from "@/lib/utils/formatCurrency";

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-none border shadow-sm p-8 sticky top-24">
            <h2 className="text-xl md:text-2xl font-bold mb-8 font-header tracking-tight">Tóm tắt đơn hàng</h2>

            <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center text-zinc-600">
                    <span>Mặt hàng ({cart.totalItems})</span>
                    <span className="tabular-nums">{formatCurrency(cart.totalAmount)}</span>
                </div>

                <div className="flex justify-between items-center text-zinc-400 italic text-[11px]">
                    <span>Phí vận chuyển</span>
                    <span>Tính khi thanh toán</span>
                </div>

                <div className="border-t pt-6 mt-6 flex justify-between items-center">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <span className="text-2xl font-black tracking-tighter text-zinc-900 tabular-nums">
                        {formatCurrency(cart.totalAmount)}
                    </span>
                </div>
            </div>

            <Button
                className="w-full mt-8 rounded-none h-12 font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20"
                size="lg"
                onClick={() => router.push("/checkout")}
            >
                Tiến hành thanh toán
            </Button>

            <div className="mt-8 pt-8 border-t">
                <div className="flex items-start gap-3 text-xs text-zinc-500">
                    <div className="h-5 w-5 rounded-none bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-zinc-700">Chương trình Bảo vệ Người mua</p>
                        <p className="leading-relaxed">Giao dịch của bạn được bảo mật và hỗ trợ hoàn tiền nếu có sự cố.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
