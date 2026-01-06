"use client";

import { CartDTO } from "@/types/cart.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface CartSummaryProps {
    cart: CartDTO;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    return (
        <div className="bg-white border-2 border-black sticky top-24 p-0">
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest">Tóm tắt đơn hàng</h2>
                <span className="font-mono text-xs text-white/50">INV-{Date.now().toString().slice(-4)}</span>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-mono text-xs uppercase text-zinc-500">Tạm tính ({cart.totalItems} SP)</span>
                        <span className="font-mono font-bold">{formatCurrency(cart.totalAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-mono text-xs uppercase text-zinc-500">Phí vận chuyển</span>
                        <span className="font-mono text-[10px] bg-zinc-100 px-2 py-1">TÍNH LÚC THANH TOÁN</span>
                    </div>

                    <div className="border-t-2 border-black mt-4 pt-4 flex justify-between items-end">
                        <span className="font-black uppercase tracking-tight text-lg">Tổng cộng</span>
                        <span className="text-2xl font-black tracking-tighter tabular-nums text-[#FF4400]">
                            {formatCurrency(cart.totalAmount)}
                        </span>
                    </div>
                </div>

                <Button
                    className="w-full h-14 bg-black text-white hover:bg-[#FF4400] hover:text-white rounded-none font-black text-sm uppercase tracking-[0.2em] transition-all border-2 border-transparent hover:border-black"
                    onClick={() => router.push("/checkout")}
                >
                    Thanh toán ngay
                </Button>

                <div className="border-t border-zinc-200 pt-6">
                    <div className="flex items-start gap-4">
                        <div className="h-8 w-8 flex-shrink-0 bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-zinc-900" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-xs uppercase tracking-wide">Bảo vệ người mua</p>
                            <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                                GIAO DỊCH CỦA BẠN ĐƯỢC BẢO MẬT TUYỆT ĐỐI. HOÀN TIỀN 100% NẾU CÓ SỰ CỐ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
