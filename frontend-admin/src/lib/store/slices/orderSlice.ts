import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderService } from '@/lib/services/order-service';
import {
    AdminOrderGroup,
    AdminSubOrder,
    OrderFilterRequest,
    TrackingUpdateRequest
} from '@/types/order/order';

interface OrderState {
    orders: AdminOrderGroup[];
    currentOrder: AdminOrderGroup | null;
    loading: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
    };
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    pagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
    },
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (params: OrderFilterRequest, { rejectWithValue }) => {
        try {
            const response = await orderService.getOrders(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchOrderDetails',
    async (groupId: number, { rejectWithValue }) => {
        try {
            const response = await orderService.getOrderDetails(groupId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ groupId, status, notes }: { groupId: number; status: string; notes?: string }, { rejectWithValue }) => {
        try {
            const response = await orderService.updateOrderStatus(groupId, status, notes);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
        }
    }
);

export const updateSubOrderStatus = createAsyncThunk(
    'orders/updateSubOrderStatus',
    async ({ groupId, subOrderId, status, notes }: { groupId: number; subOrderId: number; status: string; notes?: string }, { rejectWithValue }) => {
        try {
            const response = await orderService.updateSubOrderStatus(groupId, subOrderId, status, notes);
            return { groupId, subOrderId, subOrder: response };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update sub-order status');
        }
    }
);

export const updateSubOrderTracking = createAsyncThunk(
    'orders/updateSubOrderTracking',
    async ({ groupId, subOrderId, data }: { groupId: number; subOrderId: number; data: TrackingUpdateRequest }, { rejectWithValue }) => {
        try {
            const response = await orderService.updateSubOrderTracking(groupId, subOrderId, data);
            return { groupId, subOrderId, subOrder: response };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update tracking info');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Orders
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.content;
            state.pagination = {
                pageNumber: action.payload.number,
                pageSize: action.payload.size,
                totalElements: action.payload.totalElements,
                totalPages: action.payload.totalPages,
            };
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Order Details
        builder.addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.currentOrder = action.payload;
        });
        builder.addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Order Status
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.currentOrder = action.payload;
            // Update in list if exists
            const index = state.orders.findIndex(o => o.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        });

        // Update Sub-Order Status
        builder.addCase(updateSubOrderStatus.fulfilled, (state, action) => {
            if (state.currentOrder && state.currentOrder.id === action.payload.groupId) {
                const subIndex = state.currentOrder.subOrders.findIndex(so => so.id === action.payload.subOrderId);
                if (subIndex !== -1) {
                    state.currentOrder.subOrders[subIndex] = action.payload.subOrder;
                }
            }
        });

        // Update Tracking
        builder.addCase(updateSubOrderTracking.fulfilled, (state, action) => {
            if (state.currentOrder && state.currentOrder.id === action.payload.groupId) {
                const subIndex = state.currentOrder.subOrders.findIndex(so => so.id === action.payload.subOrderId);
                if (subIndex !== -1) {
                    state.currentOrder.subOrders[subIndex] = action.payload.subOrder;
                }
            }
        });
    },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
