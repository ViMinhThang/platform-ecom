import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { validateAndAddVoucher, toggleVoucherSelection, setAppliedVoucherCodes, fetchAutoApplyVouchers } from '@/lib/store/slices/promotionSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, TicketPercent, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { VoucherDTO } from '@/types/promotion.types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from 'react';

export function VoucherSection() {
    const dispatch = useAppDispatch();
    const { appliedVoucherCodes, discountResult, availableVouchers } = useAppSelector((state) => state.promotion);

    // Initial fetch of vouchers
    useEffect(() => {
        dispatch(fetchAutoApplyVouchers());
    }, [dispatch]);

    // Group vouchers by type
    const productVouchers = useMemo(() => availableVouchers.filter(v => v.category === 'PRODUCT'), [availableVouchers]);
    const shippingVouchers = useMemo(() => availableVouchers.filter(v => v.category === 'SHIPPING'), [availableVouchers]);

    // Derived state for display
    const totalSavings = discountResult ? discountResult.totalDiscount : 0;
    const appliedCount = appliedVoucherCodes.length;

    return (
        <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-foreground">
                    <TicketPercent className="h-4 w-4 text-primary" />
                    Vouchers
                </h3>
                <VoucherManagerSheet />
            </div>

            {/* Selected Vouchers Summary */}
            {appliedCount > 0 ? (
                <div className="bg-muted/30 border border-border p-4 rounded-sm space-y-3 shadow-inner">
                    {appliedVoucherCodes.map(code => {
                        const voucher = availableVouchers.find(v => (v.code === code || `ID:${v.id}` === code));
                        const displayCode = voucher ? (voucher.code || 'AUTO APPLY') : code;
                        return (
                            <div key={code} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-foreground">{displayCode}</span>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-sm text-[8px] tracking-[0.1em]">
                                    APPLIED
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
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50 italic">Chưa áp dụng voucher</div>
            )}
        </div>
    );
}

function VoucherManagerSheet() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { availableVouchers, appliedVoucherCodes, checkingCode, discountResult } = useAppSelector((state) => state.promotion);
    const [inputCode, setInputCode] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Local state for selection before applying
    // Actually we can use the Redux state directly since "Apply" button in sheet confirms it? 
    // Or we want real-time update? Let's use Redux state for real-time selection.

    const productVouchers = availableVouchers.filter(v => v.category === 'PRODUCT');
    const shippingVouchers = availableVouchers.filter(v => v.category === 'SHIPPING');

    const handleAddVoucher = async () => {
        if (!inputCode) return;
        if (!user) {
            toast.error("Please login to apply vouchers");
            return;
        }

        try {
            await dispatch(validateAndAddVoucher({ code: inputCode, userId: Number(user.userId) })).unwrap();
            toast.success("Voucher added!");
            setInputCode('');
        } catch (err: any) {
            toast.error(err as string);
        }
    };

    const handleSelection = (category: 'PRODUCT' | 'SHIPPING', identifier: string) => {
        const currentSelection = [...appliedVoucherCodes];
        
        // Remove existing of same category
        const filtered = currentSelection.filter(c => {
            const v = availableVouchers.find(av => (av.code === c || `ID:${av.id}` === c));
            return v?.category !== category;
        });

        // Add new one
        if (identifier !== 'NONE') {
            filtered.push(identifier);
        }

        dispatch(setAppliedVoucherCodes(filtered));
    };

    const getSelectedCode = (category: 'PRODUCT' | 'SHIPPING') => {
        // Prefer the actual applied voucher from calculation result
        if (discountResult) {
            const applied = category === 'PRODUCT' ? discountResult.appliedProductVoucher : discountResult.appliedShippingVoucher;
            if (applied) return applied.code || `ID:${applied.id}`;
        }

        // Fallback to manual selection in state
        const codeInState = appliedVoucherCodes.find(c => {
            const v = availableVouchers.find(av => (av.code === c || `ID:${av.id}` === c));
            return v?.category === category;
        });

        return codeInState || 'NONE';
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-wider h-8">
                    Select / Add
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0 gap-0">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-base font-bold uppercase tracking-[0.2em] text-foreground">Vouchers</SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Add Voucher Input */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nhập mã voucher</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                placeholder="MÃ GIẢM GIÁ" 
                                className="font-bold uppercase tracking-widest h-12"
                            />
                            <Button onClick={handleAddVoucher} disabled={checkingCode || !inputCode} className="h-12 px-6 shadow-lg shadow-primary/10">
                                {checkingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : 'THÊM'}
                            </Button>
                        </div>
                    </div>

                    {/* Product Vouchers */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-black uppercase tracking-wider">Product Discounts</Label>
                            <Badge variant="outline" className="text-[10px]">Select 1</Badge>
                        </div>
                        
                        {productVouchers.length > 0 ? (
                            <RadioGroup 
                                value={getSelectedCode('PRODUCT')} 
                                onValueChange={(val) => handleSelection('PRODUCT', val)}
                                className="gap-3"
                            >
                                <div className="flex items-center space-x-2 border p-3 rounded-sm">
                                    <RadioGroupItem value="NONE" id="prod-none" />
                                    <Label htmlFor="prod-none" className="text-sm cursor-pointer flex-1 text-zinc-500">None</Label>
                                </div>
                                {productVouchers.map(v => (
                                    <VoucherItem key={v.id} voucher={v} />
                                ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-xs text-zinc-400 italic">No product vouchers available</p>
                        )}
                    </div>

                    {/* Shipping Vouchers */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-[11px] font-bold uppercase tracking-widest">Voucher Vận Chuyển</Label>
                            <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-primary/20 text-primary">Chọn 1</Badge>
                        </div>
                        
                        {shippingVouchers.length > 0 ? (
                            <RadioGroup 
                                value={getSelectedCode('SHIPPING')} 
                                onValueChange={(val) => handleSelection('SHIPPING', val)}
                                className="gap-4"
                            >
                                <div className="flex items-center space-x-3 border border-border p-4 rounded-sm hover:bg-muted/30 transition-colors">
                                    <RadioGroupItem value="NONE" id="ship-none" />
                                    <Label htmlFor="ship-none" className="text-[10px] font-bold uppercase tracking-widest cursor-pointer flex-1 text-muted-foreground">Không sử dụng</Label>
                                </div>
                                {shippingVouchers.map(v => (
                                    <VoucherItem key={v.id} voucher={v} />
                                ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-50 italic">Không có voucher vận chuyển</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/30">
                    <Button className="w-full h-12 font-bold uppercase tracking-widest shadow-lg shadow-primary/10" onClick={() => setIsOpen(false)}>
                        Hoàn tất
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function VoucherItem({ voucher }: { voucher: VoucherDTO }) {
    const { appliedVoucherCodes, discountResult } = useAppSelector((state) => state.promotion);
    
    const voucherIdentifier = voucher.code || `ID:${voucher.id}`;
    
    // Check if this specific voucher is currently the one applied by the backend
    const isActuallyApplied = discountResult && (
        (voucher.category === 'PRODUCT' && discountResult.appliedProductVoucher?.id === voucher.id) ||
        (voucher.category === 'SHIPPING' && discountResult.appliedShippingVoucher?.id === voucher.id)
    );

    const isSelectedInState = appliedVoucherCodes.includes(voucherIdentifier);
    const isApplied = isActuallyApplied || isSelectedInState;

    return (
        <Label 
            htmlFor={voucherIdentifier} 
            className={`flex items-start space-x-4 border p-4 rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-sm ${isApplied ? 'border-primary bg-primary/[0.03] shadow-md shadow-primary/5' : 'border-border hover:bg-muted/30 hover:shadow-md'}`}
        >
            <RadioGroupItem value={voucherIdentifier} id={voucherIdentifier} className="mt-1" />
            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-[13px] tracking-widest uppercase flex items-center gap-2 text-foreground">
                        {voucher.code || 'MÃ TỰ ĐỘNG'}
                        {isActuallyApplied && <Check className="h-4 w-4 text-primary" />}
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
                            <AlertCircle className="h-3 w-3" />
                        </div>
                        Đơn tối thiểu {formatCurrency(voucher.minOrderAmount)}
                    </div>
                )}
            </div>
        </Label>
    );
}
