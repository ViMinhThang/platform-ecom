import api from '@/lib/api/axios.config';
import {
    OrderGroupDTO,
    CreateOrderRequest,
    SubOrderDTO
} from '@/types/order.types';
import { APIResponse, PaginatedResponse } from '@/types/common.types';

const ORDER_API = '/api/v1/order-groups';
const SUBORDER_API = '/api/v1/sub-orders';

export const orderService = {
    // Create order group from cart (checkout)
    createOrder: async (request: CreateOrderRequest): Promise<OrderGroupDTO> => {
        const { data } = await api.post<APIResponse<OrderGroupDTO>>(
            ORDER_API,
            request
        );
        return data.data;
    },

    // Get user's order history
    getOrders: async (page = 0, size = 10): Promise<PaginatedResponse<OrderGroupDTO>> => {
        const { data } = await api.get<APIResponse<PaginatedResponse<OrderGroupDTO>>>(
            `${ORDER_API}?page=${page}&size=${size}`
        );
        return data.data;
    },

    // Get specific order details
    getOrderById: async (orderId: number): Promise<OrderGroupDTO> => {
        const { data } = await api.get<APIResponse<OrderGroupDTO>>(
            `${ORDER_API}/${orderId}`
        );
        return data.data;
    },

    // Cancel order
    cancelOrder: async (orderId: number): Promise<void> => {
        await api.post(`${ORDER_API}/${orderId}/cancel`);
    },

    // Get payment status
    getPaymentStatus: async (orderId: number): Promise<string> => {
        const { data } = await api.get<APIResponse<string>>(
            `${ORDER_API}/${orderId}/payment-status`
        );
        return data.data;
    },

    // Sub-order operations
    getSubOrder: async (subOrderId: number): Promise<SubOrderDTO> => {
        const { data } = await api.get<APIResponse<SubOrderDTO>>(
            `${SUBORDER_API}/${subOrderId}`
        );
        return data.data;
    },

    // Request refund for sub-order
    requestRefund: async (subOrderId: number, reason: string): Promise<void> => {
        await api.post(`${SUBORDER_API}/${subOrderId}/refund`, { reason });
    }
};
