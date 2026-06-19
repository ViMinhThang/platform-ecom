import { useEffect, useState } from 'react';
import { useGetAutoApplyVouchersQuery, useCalculateDiscountMutation, useGetUserProfileQuery } from '@/lib/store/api/clientApi';
import { CartDTO } from '@/types/cart.types';
import type { VoucherDTO, DiscountResult } from '@/types/promotion.types';

export function usePromotion(cart: CartDTO | null, shippingFee: number = 0) {
    const { data: user } = useGetUserProfileQuery();
    const { data: availableVouchers = [], isLoading: loading } = useGetAutoApplyVouchersQuery();
    const [calculateDiscountMutation] = useCalculateDiscountMutation();
    const [discountResult, setDiscountResult] = useState<DiscountResult | null>(null);
    const [appliedVoucherCodes, setAppliedVoucherCodes] = useState<string[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);

    // Auto-apply best voucher when availableVouchers load
    useEffect(() => {
        if (availableVouchers.length > 0 && appliedVoucherCodes.length === 0) {
            const maxDiscount = Math.max(...availableVouchers.map(v => v.discountValue), -1);
            const bestVoucher = availableVouchers.find(v => v.discountValue === maxDiscount) ?? null;

            const codes: string[] = [];
            if (bestVoucher) codes.push(bestVoucher.code || `ID:${bestVoucher.id}`);
            
            setAppliedVoucherCodes(codes);
        }
    }, [availableVouchers]);

    // Recalculate discount when cart changes or applied codes change
    useEffect(() => {
        if (!cart || !user || appliedVoucherCodes.length === 0) {
            setDiscountResult(null);
            return;
        }

        const calculate = async () => {
            setIsCalculating(true);
            try {
                const result = await calculateDiscountMutation({
                    items: cart.items,
                    shippingFee: shippingFee,
                    voucherCodes: appliedVoucherCodes.filter(c => !c.startsWith('ID:')),
                    userId: Number(user.userId)
                }).unwrap();
                setDiscountResult(result);
            } catch (error) {
                console.error('Failed to calculate discount:', error);
                setDiscountResult(null);
            } finally {
                setIsCalculating(false);
            }
        };

        calculate();
    }, [cart, appliedVoucherCodes, user, shippingFee, calculateDiscountMutation]);

    const toggleVoucherSelection = (code: string) => {
        setAppliedVoucherCodes(prev => {
            if (prev.includes(code)) {
                return prev.filter(c => c !== code);
            }
            return [...prev, code];
        });
    };

    const clearPromotions = () => {
        setAppliedVoucherCodes([]);
        setDiscountResult(null);
    };

    return {
        availableVouchers,
        discountResult,
        appliedVoucherCodes,
        loading: loading || isCalculating,
        toggleVoucherSelection,
        setAppliedVoucherCodes,
        clearPromotions
    };
}
