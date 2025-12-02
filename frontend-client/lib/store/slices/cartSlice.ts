import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '@/lib/services/cart.service';
import { CartDTO, AddToCartRequest, CartBySeller } from '@/types/cart.types';

interface CartState {
    cart: CartDTO | null;
    cartBySeller: CartBySeller[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    cartBySeller: [],
    loading: false,
    error: null
};

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        return await cartService.getCart();
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (request: AddToCartRequest) => {
        return await cartService.addToCart(request);
    }
);

export const updateCartQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async (params: { productId: number; variantId?: number; change: number }) => {
        return await cartService.updateQuantity(
            params.productId,
            params.variantId,
            params.change
        );
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeItem',
    async (params: { productId: number; variantId?: number }) => {
        await cartService.removeItem(params.productId, params.variantId);
        return params;
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async () => {
        await cartService.clearCart();
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartState: (state) => {
            state.cart = null;
            state.cartBySeller = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartDTO>) => {
                state.loading = false;
                state.cart = action.payload;
                state.cartBySeller = groupItemsBySeller(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch cart';
            })
            // Add to cart
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartDTO>) => {
                state.cart = action.payload;
                state.cartBySeller = groupItemsBySeller(action.payload);
            })
            // Update quantity
            .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<CartDTO>) => {
                state.cart = action.payload;
                state.cartBySeller = groupItemsBySeller(action.payload);
            })
            // Remove item
            .addCase(removeCartItem.fulfilled, (state) => {
                // Cart will be refreshed by fetchCart usually, but we can optimistically update if needed
                // For now, we rely on the component to refetch or the backend to return updated cart
            })
            // Clear cart
            .addCase(clearCart.fulfilled, (state) => {
                state.cart = null;
                state.cartBySeller = [];
            });
    }
});

// Helper function to group cart items by seller
function groupItemsBySeller(cart: CartDTO): CartBySeller[] {
    if (!cart || !cart.items) return [];

    const grouped = cart.items.reduce((acc, item) => {
        if (!acc[item.sellerId]) {
            acc[item.sellerId] = {
                sellerId: item.sellerId,
                sellerName: item.sellerName,
                items: [],
                subtotal: 0
            };
        }
        acc[item.sellerId].items.push(item);
        acc[item.sellerId].subtotal += item.totalPrice;
        return acc;
    }, {} as Record<number, CartBySeller>);

    return Object.values(grouped);
}

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
