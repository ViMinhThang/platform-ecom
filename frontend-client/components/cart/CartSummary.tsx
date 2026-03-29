"use client";

import { CartDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { usePromotion } from "@/hooks/usePromotion";
import { VoucherSection } from "@/components/checkout/VoucherSection";

interface CartSummaryProps {
    cart: CartDTO;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();
    const { discountResult, appliedVoucherCodes } = usePromotion(cart);

    const finalTotal = discountResult ? discountResult.finalTotal : cart.totalAmount;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-1000">
            {/* Header: Simplified Section Title */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary font-labels">THÔNG TIN ĐƠN HÀNG</span>
                    <div className="h-px bg-primary/10 flex-1" />
                </div>
            </div>

            {/* Calculations List */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 font-labels">Tạm tính</span>
                        <div className="flex-1 border-b border-foreground/5 border-dotted mx-4 mb-1" />
                        <span className="font-labels font-bold text-lg text-foreground">{formatCurrency(cart.totalAmount)}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 font-labels">Phí vận chuyển</span>
                        <div className="flex-1 border-b border-foreground/5 border-dotted mx-4 mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 font-labels">Tính khi thanh toán</span>
                    </div>

                    {discountResult && discountResult.totalDiscount > 0 && (
                        <div className="flex justify-between items-end text-primary">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-labels">Giảm giá mã ưu đãi</span>
                            <div className="flex-1 border-b border-primary/10 border-dotted mx-4 mb-1" />
                            <span className="font-labels font-bold text-lg">-{formatCurrency(discountResult.totalDiscount)}</span>
                        </div>
                    )}
                </div>

                {/* Voucher Integration: Simplified */}
                <div className="pt-4">
                    <VoucherSection discountResult={discountResult} appliedVoucherCodes={appliedVoucherCodes} />
                </div>

                {/* Final Total */}
                <div className="space-y-2 pt-8 border-t border-foreground/10">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground font-labels">TỔNG CỘNG</span>
                        <span className="font-labels font-bold text-3xl text-primary tracking-tighter">
                            {formatCurrency(finalTotal)}
                        </span>
                    </div>
                </div>
            </div>

            {/* CTA Button: Modern Checkout */}
            <div className="space-y-8">
                <Button
                    className="w-full h-16 bg-primary text-white hover:bg-primary/95 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl group border-2 border-primary"
                    onClick={() => router.push("/checkout")}
                >
                    Tiến hành đặt hàng
                    <ChevronRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Security Commitment: Simplified */}
                <div className="flex items-start gap-4 pt-8 border-t border-foreground/5">
                    <ShieldCheck className="w-5 h-5 text-tertiary" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/80 font-labels">An tâm mua sắm cùng ACME</p>
                        <p className="text-[9px] leading-relaxed text-foreground/40 font-bold uppercase tracking-wider font-labels">
                            Mọi đơn hàng đều được ACME bảo vệ 100%. 
                            Hoàn trả giá trị nếu sản phẩm không đúng mô tả hoặc gặp lỗi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
