import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useGetAutoApplyVouchersQuery, useGetUserProfileQuery } from '@/lib/store/api/clientApi';

const EMPTY_VOUCHER_CODES: string[] = [];
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, TicketPercent, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { VoucherDTO, DiscountResult } from '@/types/promotion.types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VoucherSectionProps {
    discountResult?: DiscountResult | null;
    appliedVoucherCodes?: string[];
    onAppliedVoucherCodesChange: Dispatch<SetStateAction<string[]>>;
}

export function VoucherSection({
    discountResult,
    appliedVoucherCodes = EMPTY_VOUCHER_CODES,
    onAppliedVoucherCodesChange,
}: VoucherSectionProps) {
    const { data: availableVouchers = [] } = useGetAutoApplyVouchersQuery();

    const totalSavings = discountResult ? discountResult.totalDiscount : 0;
    const appliedCount = appliedVoucherCodes.length;

    return (
        <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] flex items-center gap-2 text-foreground">
                    <TicketPercent className="size-4 text-primary" />
                    Mã giảm giá
                </h3>
                <VoucherManagerSheet
                    availableVouchers={availableVouchers}
                    discountResult={discountResult}
                    appliedCodes={appliedVoucherCodes}
                    setAppliedCodes={onAppliedVoucherCodesChange}
                />
            </div>

            {appliedCount > 0 ? (
                <div className="bg-muted/30 border border-border p-4 rounded-sm space-y-3">
                    {appliedVoucherCodes.map(code => {
                        const voucher = availableVouchers.find(v => (v.code === code || `ID:${v.id}` === code));
                        const displayCode = voucher ? (voucher.code || 'TỰ ĐỘNG') : code;
                        return (
                            <div key={code} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-foreground">{displayCode}</span>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-sm text-[8px] tracking-[0.1em]">
                                    ĐÃ ÁP DỤNG
                                </Badge>
                            </div>
                        );
                    })}
                    {totalSavings > 0 && (
                        <div className="pt-3 border-t border-dashed border-border flex justify-between text-[11px] font-bold text-primary tracking-widest uppercase">
                            <span>Tiết kiệm</span>
                            <span>-{formatCurrency(totalSavings)}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50 italic">Chưa áp dụng mã giảm giá</div>
            )}
        </div>
    );
}

interface VoucherManagerSheetProps {
    availableVouchers: VoucherDTO[];
    discountResult?: DiscountResult | null;
    appliedCodes: string[];
    setAppliedCodes: Dispatch<SetStateAction<string[]>>;
}

function VoucherManagerSheet({ availableVouchers, discountResult, appliedCodes, setAppliedCodes }: VoucherManagerSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const { data: user } = useGetUserProfileQuery();

    const handleSelection = (identifier: string) => {
        if (identifier === 'NONE') {
            setAppliedCodes([]);
        } else {
            setAppliedCodes([identifier]);
        }
    };

    const getSelectedCode = () => {
        if (discountResult && discountResult.appliedProductVoucher) {
            const applied = discountResult.appliedProductVoucher;
            return applied.code || `ID:${applied.id}`;
        }

        return appliedCodes[0] || 'NONE';
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-wider h-8">
                    Chọn / Thêm
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 gap-0">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-base font-bold uppercase tracking-[0.2em] text-foreground">Mã giảm giá</SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-black uppercase tracking-wider">Mã giảm giá khả dụng</Label>
                            <Badge variant="outline" className="text-[10px]">Chọn 1</Badge>
                        </div>
                        
                        {availableVouchers.length > 0 ? (
                            <RadioGroup 
                                value={getSelectedCode()} 
                                onValueChange={handleSelection}
                                className="gap-3"
                            >
                                <div className="flex items-center gap-x-2 border p-3 rounded-sm">
                                    <RadioGroupItem value="NONE" id="voucher-none" />
                                    <Label htmlFor="voucher-none" className="text-sm cursor-pointer flex-1 text-zinc-500">Không sử dụng</Label>
                                </div>
                                {availableVouchers.map(v => (
                                    <VoucherItem key={v.id} voucher={v} appliedCodes={appliedCodes} discountResult={discountResult} />
                                ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-xs text-zinc-400 italic">Không có mã giảm giá khả dụng</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/30">
                    <Button className="w-full h-12 font-bold uppercase tracking-widest" onClick={() => setIsOpen(false)}>
                        Hoàn tất
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

interface VoucherItemProps {
    voucher: VoucherDTO;
    appliedCodes: string[];
    discountResult?: DiscountResult | null;
}

function VoucherItem({ voucher, appliedCodes, discountResult }: VoucherItemProps) {
    const voucherIdentifier = voucher.code || `ID:${voucher.id}`;
    
    const isActuallyApplied = discountResult && discountResult.appliedProductVoucher?.id === voucher.id;

    const isSelectedInState = appliedCodes.includes(voucherIdentifier);
    const isApplied = isActuallyApplied || isSelectedInState;

    return (
        <Label 
            htmlFor={voucherIdentifier} 
            className={`flex items-start gap-x-4 border p-4 rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden group ${isApplied ? 'border-primary bg-primary/[0.03]' : 'border-border hover:bg-muted/30'}`}
        >
            <RadioGroupItem value={voucherIdentifier} id={voucherIdentifier} className="mt-1" />
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-[13px] tracking-widest uppercase flex items-center gap-2 text-foreground">
                        {voucher.code || 'MÃ TỰ ĐỘNG'}
                        {isActuallyApplied && <Check className="size-4 text-primary" />}
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                        <Badge className={`${isActuallyApplied ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} text-[9px] font-bold tracking-widest uppercase rounded-sm border-none`}>
                            {voucher.type === 'PERCENTAGE' ? `${voucher.discountValue}% GIẢM` : `-${formatCurrency(voucher.discountValue)}`}
                        </Badge>
                        {voucher.applyMode === 'AUTO' && (
                            <Badge variant="outline" className="text-[7px] border-primary/30 text-primary px-1.5 py-0 uppercase font-bold tracking-[0.1em]">Tự động</Badge>
                        )}
                    </div>
                </div>
                <p className="text-[10px] text-foreground font-bold uppercase tracking-widest opacity-80">{voucher.name}</p>
                {voucher.description && <p className="text-[9px] text-muted-foreground font-medium line-clamp-1 italic">{voucher.description}</p>}
                {voucher.minOrderAmount > 0 && (
                    <div className="text-[9px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 pt-1">
                        <div className="bg-primary/10 p-1 rounded-sm">
                            <AlertCircle className="size-3" />
                        </div>
                        Đơn tối thiểu {formatCurrency(voucher.minOrderAmount)}
                    </div>
                )}
            </div>
        </Label>
    );
}
