import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminOrderGroup, AdminSubOrder } from '@/types/order/order';

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

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<AdminOrderGroup[]>) => {
            state.orders = action.payload;
        },
        updateOrderInList: (state, action: PayloadAction<AdminOrderGroup>) => {
            const index = state.orders.findIndex((o) => o.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        },
        setCurrentOrder: (state, action: PayloadAction<AdminOrderGroup | null>) => {
            state.currentOrder = action.payload;
        },
        updateSubOrder: (state, action: PayloadAction<{ groupId: number; subOrderId: number; subOrder: AdminSubOrder }>) => {
            if (state.currentOrder && state.currentOrder.id === action.payload.groupId) {
                const subIndex = state.currentOrder.subOrders.findIndex((so) => so.id === action.payload.subOrderId);
                if (subIndex !== -1) {
                    state.currentOrder.subOrders[subIndex] = action.payload.subOrder;
                }
            }
        },
        setPagination: (state, action: PayloadAction<Omit<OrderState['pagination'], never>>) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setOrders,
    updateOrderInList,
    setCurrentOrder,
    updateSubOrder,
    setPagination,
    setLoading,
    setError,
    clearCurrentOrder,
    clearError,
} = orderSlice.actions;

export default orderSlice.reducer;
