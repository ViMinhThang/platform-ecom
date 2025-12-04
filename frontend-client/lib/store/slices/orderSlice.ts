import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '@/lib/services/order.service';
import {
    OrderGroupDTO,
    CreateOrderRequest,
    CheckoutSession,
    ConfirmPaymentRequest
} from '@/types/order.types';
import { PaginatedResponse } from '@/types/common.types';

interface OrderState {
    orders: OrderGroupDTO[];
    currentOrder: OrderGroupDTO | null;
    checkoutSession: CheckoutSession | null;
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    checkoutSession: null,
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
};

/**
 * Step 1: Initiate checkout - creates Stripe PaymentIntent
 */
export const initiateCheckout = createAsyncThunk(
    'order/initiateCheckout',
    async (request: CreateOrderRequest) => {
        return await orderService.initiateCheckout(request);
    }
);

/**
 * Step 2: Confirm payment and create order
 */
export const confirmPayment = createAsyncThunk(
    'order/confirmPayment',
    async (request: ConfirmPaymentRequest) => {
        return await orderService.confirmPayment(request);
    }
);

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (params: { page: number; size: number }) => {
        return await orderService.getOrders(params.page, params.size);
    }
);

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (orderId: number) => {
        return await orderService.getOrderById(orderId);
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (orderId: number) => {
        await orderService.cancelOrder(orderId);
        return orderId;
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearCheckoutSession: (state) => {
            state.checkoutSession = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Initiate checkout
            .addCase(initiateCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initiateCheckout.fulfilled, (state, action: PayloadAction<CheckoutSession>) => {
                state.loading = false;
                state.checkoutSession = action.payload;
            })
            .addCase(initiateCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to initiate checkout';
            })
            // Confirm payment
            .addCase(confirmPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmPayment.fulfilled, (state, action: PayloadAction<OrderGroupDTO>) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.checkoutSession = null; // Clear checkout session after order is created
            })
            .addCase(confirmPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to confirm payment';
            })
            // Fetch orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<PaginatedResponse<OrderGroupDTO>>) => {
                state.loading = false;
                state.orders = action.payload.content;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch orders';
            })
            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<OrderGroupDTO>) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch order';
            })
            // Cancel order
            .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<number>) => {
                if (state.currentOrder?.id === action.payload) {
                    // @ts-ignore - Enum compatibility issue
                    state.currentOrder.overallStatus = 'CANCELLED';
                }
                const order = state.orders.find(o => o.id === action.payload);
                if (order) {
                    // @ts-ignore
                    order.overallStatus = 'CANCELLED';
                }
            });
    }
});

export const { clearCurrentOrder, clearCheckoutSession } = orderSlice.actions;
export default orderSlice.reducer;
