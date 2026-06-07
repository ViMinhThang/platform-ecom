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
    const { push } = useRouter();
    const { discountResult, appliedVoucherCodes, setAppliedVoucherCodes } = usePromotion(cart);

    const finalTotal = discountResult ? discountResult.finalTotal : cart.totalAmount;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold font-headline mb-8 border-b border-border pb-4">Tóm tắt Đơn hàng</h2>
            
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="text-sm">Tạm tính ({cart.totalItems} sản phẩm)</span>
                    <span className="font-semibold text-on-surface">{formatCurrency(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Phí vận chuyển Ước tính</span>
                    <span className="text-secondary font-bold uppercase tracking-widest text-xs">MIỄN PHÍ</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Thuế (Ước tính)</span>
                    <span className="font-semibold text-on-surface">{formatCurrency(0)}</span>
                </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl space-y-4 shadow-sm border border-border">
                <VoucherSection
                    discountResult={discountResult}
                    appliedVoucherCodes={appliedVoucherCodes}
                    onAppliedVoucherCodesChange={setAppliedVoucherCodes}
                />
            </div>

            <div className="flex justify-between items-end mb-8 pt-4 border-t border-border">
                <span className="text-lg font-medium">Tổng cộng</span>
                <span className="text-3xl font-black text-primary tracking-tighter">
                    {formatCurrency(finalTotal)}
                </span>
            </div>

            <Button
                className="w-full bg-signature-gradient text-white py-8 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 border-none"
                onClick={() => push("/checkout")}
            >
                <span>Tiến hành Thanh toán</span>
                <ChevronRight className="size-5" strokeWidth={3} />
            </Button>

            <div className="mt-8 flex flex-col gap-4">
                <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest font-bold">Thanh toán Bảo mật bởi</p>
                <div className="flex justify-center gap-6 opacity-40 grayscale contrast-125">
                    <ShieldCheck className="size-6" />
                    <div className="w-8 h-4 bg-foreground/20 rounded-sm" />
                    <div className="w-8 h-4 bg-foreground/30 rounded-sm" />
                </div>
            </div>
        </div>
    );

}
