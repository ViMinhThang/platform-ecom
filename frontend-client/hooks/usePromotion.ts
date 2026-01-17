import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAutoApplyVouchers, calculateCartDiscount, clearPromotionState } from '@/lib/store/slices/promotionSlice';
import { CartDTO } from '@/types/cart.types';

export function usePromotion(cart: CartDTO | null, shippingFee: number = 0) {
    const dispatch = useAppDispatch();
    const { availableVouchers, discountResult, appliedVoucherCodes, loading } = useAppSelector((state) => state.promotion);
    const { user } = useAppSelector((state) => state.auth);

    // Fetch auto-apply vouchers on mount
    useEffect(() => {
        dispatch(fetchAutoApplyVouchers());
    }, [dispatch]);

    // Recalculate discount when cart changes or applied codes change
    useEffect(() => {
        if (!cart || !user) return;

        dispatch(calculateCartDiscount({
            items: cart.items,
            shippingFee: shippingFee,
            voucherCodes: appliedVoucherCodes.filter(c => !c.startsWith('ID:')),
            userId: Number(user.userId)
        }));

    }, [dispatch, cart, appliedVoucherCodes, user, shippingFee]);

    return {
        availableVouchers,
        discountResult,
        loading
    };
}
