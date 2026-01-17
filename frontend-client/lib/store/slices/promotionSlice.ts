import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { promotionService } from '@/lib/services/promotion-service';
import { VoucherDTO, DiscountResult, CalculateDiscountRequest } from '@/types/promotion.types';

interface PromotionState {
    availableVouchers: VoucherDTO[];
    appliedVoucherCodes: string[];
    discountResult: DiscountResult | null;
    loading: boolean;
    checkingCode: boolean;
    error: string | null;
    validationMessage: string | null;
}

const initialState: PromotionState = {
    availableVouchers: [],
    appliedVoucherCodes: [],
    discountResult: null,
    loading: false,
    checkingCode: false,
    error: null,
    validationMessage: null
};


export const fetchAutoApplyVouchers = createAsyncThunk(
    'promotion/fetchAutoApply',
    async () => {
        return await promotionService.getActiveAutoApplyVouchers();
    }
);

export const validateAndAddVoucher = createAsyncThunk(
    'promotion/validateAndAddVoucher',
    async ({ code, userId }: { code: string; userId: number }, { getState, rejectWithValue }) => {
        try {
            const isValid = await promotionService.validateVoucher(code, userId);
            if (!isValid) {
                return rejectWithValue('Invalid or inapplicable voucher code');
            }
            const voucher = await promotionService.getVoucherByCode(code);
            if (!voucher) return rejectWithValue('Voucher not found');

            return voucher;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to validate voucher');
        }
    }
);

export const calculateCartDiscount = createAsyncThunk(
    'promotion/calculateDiscount',
    async (request: CalculateDiscountRequest) => {
        return await promotionService.calculateDiscount(request);
    }
);

const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {
        toggleVoucherSelection: (state, action: PayloadAction<string>) => {
            const code = action.payload;
            if (state.appliedVoucherCodes.includes(code)) {
                state.appliedVoucherCodes = state.appliedVoucherCodes.filter(c => c !== code);
            } else {
                state.appliedVoucherCodes.push(code);
            }
        },
        // Used to enforce "Select 1 Product, 1 Shipping" rule in UI before calculation
        setAppliedVoucherCodes: (state, action: PayloadAction<string[]>) => {
            state.appliedVoucherCodes = action.payload;
        },
        clearPromotionState: (state) => {
            state.availableVouchers = [];
            state.appliedVoucherCodes = [];
            state.discountResult = null;
            state.error = null;
            state.validationMessage = null;
        },
        autoApplyBestVouchers: (state) => {
            if (state.availableVouchers.length === 0) return;

            const bestProduct = state.availableVouchers
                .filter(v => v.category === 'PRODUCT' && v.code)
                .sort((a, b) => b.discountValue - a.discountValue)[0];

            const bestShipping = state.availableVouchers
                .filter(v => v.category === 'SHIPPING' && v.code)
                .sort((a, b) => b.discountValue - a.discountValue)[0];

            const newCodes = [];
            if (bestProduct) newCodes.push(bestProduct.code);
            if (bestShipping) newCodes.push(bestShipping.code);

            state.appliedVoucherCodes = newCodes;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Auto Apply Vouchers
            .addCase(fetchAutoApplyVouchers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAutoApplyVouchers.fulfilled, (state, action) => {
                state.loading = false;
                state.availableVouchers = action.payload;
                
                // Auto-apply logic: if no vouchers are applied, try to pick the best ones
                if (state.appliedVoucherCodes.length === 0 && action.payload.length > 0) {
                    const productVouchers = action.payload.filter(v => v.category === 'PRODUCT');
                    const shippingVouchers = action.payload.filter(v => v.category === 'SHIPPING');

                    const bestProduct = productVouchers.sort((a, b) => b.discountValue - a.discountValue)[0];
                    const bestShipping = shippingVouchers.sort((a, b) => b.discountValue - a.discountValue)[0];

                    if (bestProduct) {
                        state.appliedVoucherCodes.push(bestProduct.code || `ID:${bestProduct.id}`);
                    }
                    if (bestShipping) {
                        state.appliedVoucherCodes.push(bestShipping.code || `ID:${bestShipping.id}`);
                    }
                }
            })
            .addCase(fetchAutoApplyVouchers.rejected, (state, action) => {
                state.loading = false;
                console.error('Failed to fetch auto-apply vouchers', action.error);
            })

            // Validate Code
            .addCase(validateAndAddVoucher.pending, (state) => {
                state.checkingCode = true;
                state.validationMessage = null;
                state.error = null;
            })
            .addCase(validateAndAddVoucher.fulfilled, (state, action) => {
                state.checkingCode = false;
                const voucher = action.payload;
                // Add to available list if not exists
                if (!state.availableVouchers.find(v => v.code === voucher.code)) {
                    state.availableVouchers.push(voucher);
                }
                state.validationMessage = 'Voucher added to your list!';
            })
            .addCase(validateAndAddVoucher.rejected, (state, action) => {
                state.checkingCode = false;
                state.error = action.payload as string;
                state.validationMessage = null;
            })

            // Calculate Discount
            .addCase(calculateCartDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(calculateCartDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discountResult = action.payload;
            })
            .addCase(calculateCartDiscount.rejected, (state, action) => {
                state.loading = false;
                console.error('Discount calculation failed', action.error);
            });
    }
});

export const { toggleVoucherSelection, setAppliedVoucherCodes, clearPromotionState } = promotionSlice.actions;
export default promotionSlice.reducer;
