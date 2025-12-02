import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order } from '@/types/user';
import { placeOrder, getUserOrders, getOrderById } from '@/lib/services/order-service';
import { getErrorMessage } from '@/lib/errors';

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        lastPage: boolean;
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
        lastPage: true,
    },
};

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async ({
        paymentMethod,
        orderRequest,
        token
    }: {
        paymentMethod: string;
        orderRequest: {
            addressId: number;
            pgName?: string;
            pgPaymentId?: string;
            pgStatus?: string;
            pgResponseMessage?: string;
        };
        token: string;
    }, { rejectWithValue }) => {
        try {
            const order = await placeOrder(paymentMethod, orderRequest, token);
            return order;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    'order/fetchUserOrders',
    async ({
        token,
        pageNumber = 0,
        pageSize = 10,
        sortBy = 'orderDate',
        sortDir = 'desc'
    }: {
        token: string;
        pageNumber?: number;
        pageSize?: number;
        sortBy?: string;
        sortDir?: string;
    }, { rejectWithValue }) => {
        try {
            // Note: getUserOrders signature is (page, size, sort, dir, token)
            const response = await getUserOrders(pageNumber, pageSize, sortBy, sortDir, token);
            return response;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async ({ orderId, token }: { orderId: number; token: string }, { rejectWithValue }) => {
        try {
            const order = await getOrderById(orderId, token);
            return order;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
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
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch User Orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.content;
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    lastPage: action.payload.lastPage,
                };
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Order By Id
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
