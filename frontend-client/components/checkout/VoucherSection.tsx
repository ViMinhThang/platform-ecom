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
                <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <TicketPercent className="h-4 w-4 text-[#FF4400]" />
                    Vouchers
                </h3>
                <VoucherManagerSheet />
            </div>

            {/* Selected Vouchers Summary */}
            {appliedCount > 0 ? (
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-sm space-y-2">
                    {appliedVoucherCodes.map(code => {
                        const voucher = availableVouchers.find(v => (v.code === code || `ID:${v.id}` === code));
                        const displayCode = voucher ? (voucher.code || 'AUTO APPLY') : code;
                        return (
                            <div key={code} className="flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-zinc-700">{displayCode}</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-none rounded-none text-[10px]">
                                    APPLIED
                                </Badge>
                            </div>
                        );
                    })}
                    {totalSavings > 0 && (
                        <div className="pt-2 border-t border-dashed border-zinc-200 flex justify-between text-xs font-bold text-green-600">
                            <span>Total Savings</span>
                            <span>-{formatCurrency(totalSavings)}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-xs text-zinc-500 italic">No vouchers applied</div>
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
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-lg font-black uppercase tracking-wide">Vouchers</SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Add Voucher Input */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Add Voucher Code</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CODE" 
                                className="font-mono uppercase"
                            />
                            <Button onClick={handleAddVoucher} disabled={checkingCode || !inputCode} className="bg-black text-white hover:bg-[#FF4400]">
                                {checkingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ADD'}
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
                            <Label className="text-sm font-black uppercase tracking-wider">Shipping Discounts</Label>
                            <Badge variant="outline" className="text-[10px]">Select 1</Badge>
                        </div>
                        
                        {shippingVouchers.length > 0 ? (
                            <RadioGroup 
                                value={getSelectedCode('SHIPPING')} 
                                onValueChange={(val) => handleSelection('SHIPPING', val)}
                                className="gap-3"
                            >
                                <div className="flex items-center space-x-2 border p-3 rounded-sm">
                                    <RadioGroupItem value="NONE" id="ship-none" />
                                    <Label htmlFor="ship-none" className="text-sm cursor-pointer flex-1 text-zinc-500">None</Label>
                                </div>
                                {shippingVouchers.map(v => (
                                    <VoucherItem key={v.id} voucher={v} />
                                ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-xs text-zinc-400 italic">No shipping vouchers available</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t bg-zinc-50">
                    <Button className="w-full font-bold uppercase tracking-widest bg-[#FF4400] hover:bg-[#FF4400]/90" onClick={() => setIsOpen(false)}>
                        Done
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
            className={`flex items-start space-x-3 border p-3 rounded-sm cursor-pointer hover:bg-zinc-50 transition-all duration-200 ${isApplied ? 'border-[#FF4400] bg-[#FF4400]/5 ring-1 ring-[#FF4400]' : 'border-zinc-200'}`}
        >
            <RadioGroupItem value={voucherIdentifier} id={voucherIdentifier} className="mt-1" />
            <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-base flex items-center gap-2">
                        {voucher.code || 'AUTO APPLY'}
                        {isActuallyApplied && <Check className="h-3 w-3 text-[#FF4400]" />}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className={`${isActuallyApplied ? 'bg-[#FF4400]' : 'bg-zinc-900'} text-[10px]`}>
                            {voucher.type === 'PERCENTAGE' ? `${voucher.discountValue}% OFF` : `-${formatCurrency(voucher.discountValue)}`}
                        </Badge>
                        {voucher.applyMode === 'AUTO' && (
                            <Badge variant="outline" className="text-[8px] border-[#FF4400] text-[#FF4400] px-1 py-0 uppercase">Auto</Badge>
                        )}
                    </div>
                </div>
                <p className="text-xs text-zinc-600 font-medium">{voucher.name}</p>
                {voucher.description && <p className="text-[10px] text-zinc-400 line-clamp-1">{voucher.description}</p>}
                {voucher.minOrderAmount > 0 && (
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Min. spend {formatCurrency(voucher.minOrderAmount)}
                    </div>
                )}
            </div>
        </Label>
    );
}
