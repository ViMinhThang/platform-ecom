import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VariantFormValues } from '@/types/product/product-variant';
import { v4 as uuidv4 } from 'uuid';

interface ProductVariantState {
    items: VariantFormValues[];
    loading: boolean;
    error: string | null;
    currentProductId: number | null;
}

const initialState: ProductVariantState = {
    items: [],
    loading: false,
    error: null,
    currentProductId: null,
};

const productVariantSlice = createSlice({
    name: 'productVariants',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<VariantFormValues[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<VariantFormValues>) => {
            state.items.push(action.payload);
        },
        updateItem: (state, action: PayloadAction<VariantFormValues>) => {
            const index = state.items.findIndex((v) => v.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        addNewVariant: (state) => {
            const newVariant: VariantFormValues = {
                tempId: uuidv4(),
                sku: '',
                price: 0,
                stock: 0,
                isActive: true,
                optionValues: [],
                imageUrl: '',
            };
            state.items.push(newVariant);
        },
        removeVariantLocally: (state, action) => {
            const variantKey = action.payload;
            state.items = state.items.filter(
                (v) => v.id !== variantKey && v.tempId !== variantKey
            );
        },
        updateVariantField: (state, action) => {
            const { variantKey, field, value } = action.payload;
            const variant = state.items.find(
                (v) => v.id === variantKey || v.tempId === variantKey
            );
            if (variant) {
                (variant as any)[field] = value;
            }
        },
        replaceTempVariant: (state, action: PayloadAction<{ tempId: string; variant: VariantFormValues }>) => {
            const { tempId, variant } = action.payload;
            const index = state.items.findIndex((v) => v.tempId === tempId);
            if (index !== -1) {
                state.items[index] = variant;
            } else {
                state.items.push(variant);
            }
        },
        setCurrentProductId: (state, action: PayloadAction<number | null>) => {
            state.currentProductId = action.payload;
        },
        clearVariants: (state) => {
            state.items = [];
            state.currentProductId = null;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    removeItem,
    addNewVariant,
    removeVariantLocally,
    updateVariantField,
    replaceTempVariant,
    setCurrentProductId,
    clearVariants,
    setLoading,
    setError,
    clearError,
} = productVariantSlice.actions;

export default productVariantSlice.reducer;
