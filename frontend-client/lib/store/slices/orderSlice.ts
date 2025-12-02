import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '@/lib/services/order.service';
import {
    OrderGroupDTO,
    CreateOrderRequest
} from '@/types/order.types';
import { PaginatedResponse } from '@/types/common.types';

interface OrderState {
    orders: OrderGroupDTO[];
    currentOrder: OrderGroupDTO | null;
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
};

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (request: CreateOrderRequest) => {
        return await orderService.createOrder(request);
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderGroupDTO>) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create order';
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
                    // @ts-ignore - Enum compatibility issue, treating as string for now
                    state.currentOrder.overallStatus = 'CANCELLED';
                }
                // Update in list as well
                const order = state.orders.find(o => o.id === action.payload);
                if (order) {
                    // @ts-ignore
                    order.overallStatus = 'CANCELLED';
                }
            });
    }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
