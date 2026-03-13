"use client";

import { CartDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useAppSelector } from "@/lib/store/hooks";
import { VoucherSection } from "@/components/checkout/VoucherSection";

interface CartSummaryProps {
    cart: CartDTO;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();
    const { discountResult } = useAppSelector((state) => state.promotion);

    const finalTotal = discountResult ? discountResult.finalTotal : cart.totalAmount;

    return (
        <div className="bg-background border border-border sticky top-24 p-0 shadow-lg rounded-sm overflow-hidden font-header">
            <div className="bg-muted/30 border-b border-border px-6 py-4 flex justify-between items-center">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Tóm tắt đơn hàng</h2>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">INV-{Date.now().toString().slice(-4)}</span>
            </div>

            <div className="p-6 space-y-6">

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tạm tính ({cart.totalItems})</span>
                        <span className="font-bold tracking-tighter">{formatCurrency(cart.totalAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phí vận chuyển</span>
                        <span className="text-[9px] font-bold bg-muted px-2 py-1 rounded-sm uppercase tracking-widest text-muted-foreground">TÍNH LÚC THANH TOÁN</span>
                    </div>

                    {discountResult && discountResult.totalDiscount > 0 && (
                        <div className="flex justify-between items-center text-primary">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Giảm giá voucher</span>
                            <span className="font-bold tracking-tighter">-{formatCurrency(discountResult.totalDiscount)}</span>
                        </div>
                    )}

                    {/* Voucher Section Integration */}
                    <div className="pt-2">
                        <VoucherSection />
                    </div>

                    <div className="border-t border-border mt-4 pt-4 flex justify-between items-end">
                        <span className="font-bold uppercase tracking-widest text-xs">Tổng cộng</span>
                        <span className="text-2xl font-bold tracking-tighter tabular-nums text-primary">
                            {formatCurrency(finalTotal)}
                        </span>
                    </div>
                </div>

                <Button
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-md border-none"
                    onClick={() => router.push("/checkout")}
                >
                    Thanh toán ngay
                </Button>

                <div className="border-t border-border pt-6">
                    <div className="flex items-start gap-4">
                        <div className="h-8 w-8 flex-shrink-0 bg-muted/50 border border-border flex items-center justify-center rounded-sm">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-[10px] uppercase tracking-widest text-foreground">Bảo vệ người mua</p>
                            <p className="text-[9px] text-muted-foreground font-bold tracking-widest leading-relaxed uppercase opacity-50">
                                GIAO DỊCH CỦA BẠN ĐƯỢC BẢO MẬT TUYỆT ĐỐI. HOÀN TIỀN 100% NẾU CÓ SỰ CỐ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
