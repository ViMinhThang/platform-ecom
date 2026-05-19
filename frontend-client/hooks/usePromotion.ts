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

    // Auto-apply best vouchers when availableVouchers load
    useEffect(() => {
        if (availableVouchers.length > 0 && appliedVoucherCodes.length === 0) {
            const productVouchers = availableVouchers.filter(v => v.category === 'PRODUCT');
            const shippingVouchers = availableVouchers.filter(v => v.category === 'SHIPPING');

            const bestProduct = productVouchers.sort((a, b) => b.discountValue - a.discountValue)[0];
            const bestShipping = shippingVouchers.sort((a, b) => b.discountValue - a.discountValue)[0];

            const codes: string[] = [];
            if (bestProduct) codes.push(bestProduct.code || `ID:${bestProduct.id}`);
            if (bestShipping) codes.push(bestShipping.code || `ID:${bestShipping.id}`);
            
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
