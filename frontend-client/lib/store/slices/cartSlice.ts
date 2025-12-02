import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Cart } from '@/types/cart';
import { getCart, addToCart, updateCartItem, deleteFromCart } from '@/lib/services/cart-service';
import { getErrorMessage } from '@/lib/errors';

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (token: string | undefined, { rejectWithValue }) => {
        if (!token) {
            return rejectWithValue('Not authenticated');
        }
        try {
            const cart = await getCart(token);
            return cart;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const addItemToCart = createAsyncThunk(
    'cart/addItem',
    async ({ productId, quantity, variantId, token }: { productId: number; quantity: number; variantId: number | null; token: string }, { rejectWithValue }) => {
        try {
            const cart = await addToCart(productId, quantity, variantId, token);
            return cart;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const updateItemInCart = createAsyncThunk(
    'cart/updateItem',
    async ({ productId, quantityChange, variantId, token }: { productId: number; quantityChange: number; variantId: number | undefined; token: string }, { rejectWithValue }) => {
        try {
            const cart = await updateCartItem(productId, quantityChange, variantId, token);
            return cart;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const removeItemFromCart = createAsyncThunk(
    'cart/removeItem',
    async ({ productId, variantId, token }: { productId: number; variantId: number | undefined; token: string }, { rejectWithValue }) => {
        try {
            await deleteFromCart(productId, variantId, token);
            return { productId, variantId };
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cart = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Item
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Item
            .addCase(updateItemInCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemInCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(updateItemInCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Remove Item
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.loading = false;
                if (state.cart) {
                    state.cart.products = state.cart.products.filter(
                        item => !(item.id === action.payload.productId && item.variantId === action.payload.variantId)
                    );
                    // Recalculate total price client-side or assume fetchCart will be called?
                    // Ideally we should fetchCart after remove, or backend returns updated cart on delete.
                    // But delete returns void.
                    // We can just subtract price.
                    // But simpler to just filter for now.
                }
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
