import apiClient from '@/lib/api-client';
import {
    OrderGroupDTO,
    CreateOrderRequest,
    SubOrderDTO,
    CheckoutSession,
    ConfirmPaymentRequest
} from '@/types/order.types';
import { APIResponse, PaginatedResponse } from '@/types/common.types';

const ORDER_API = '/v1/order-groups';
const SUBORDER_API = '/v1/sub-orders';

export const orderService = {
    /**
     * Step 1: Initiate checkout - creates Stripe PaymentIntent
     * No order is created yet
     */
    initiateCheckout: async (request: CreateOrderRequest): Promise<CheckoutSession> => {
        const { data } = await apiClient.post<APIResponse<CheckoutSession>>(
            `${ORDER_API}/initiate-checkout`,
            request
        );
        return data.data;
    },

    /**
     * Step 2: Confirm payment and create order
     * Called after Stripe payment succeeds
     */
    confirmPayment: async (request: ConfirmPaymentRequest): Promise<OrderGroupDTO> => {
        const { data } = await apiClient.post<APIResponse<OrderGroupDTO>>(
            `${ORDER_API}/confirm-payment`,
            request
        );
        return data.data;
    },

    getOrders: async (page = 0, size = 10): Promise<PaginatedResponse<OrderGroupDTO>> => {
        const { data } = await apiClient.get<APIResponse<PaginatedResponse<OrderGroupDTO>>>(
            `${ORDER_API}?page=${page}&size=${size}`
        );
        return data.data;
    },

    getOrderById: async (orderId: number): Promise<OrderGroupDTO> => {
        const { data } = await apiClient.get<APIResponse<OrderGroupDTO>>(
            `${ORDER_API}/${orderId}`
        );
        return data.data;
    },

    cancelOrder: async (orderId: number): Promise<void> => {
        await apiClient.post(`${ORDER_API}/${orderId}/cancel`);
    },

    getPaymentStatus: async (orderId: number): Promise<string> => {
        const { data } = await apiClient.get<APIResponse<string>>(
            `${ORDER_API}/${orderId}/payment-status`
        );
        return data.data;
    },

    getSubOrder: async (subOrderId: number): Promise<SubOrderDTO> => {
        const { data } = await apiClient.get<APIResponse<SubOrderDTO>>(
            `${SUBORDER_API}/${subOrderId}`
        );
        return data.data;
    },

    requestRefund: async (subOrderId: number, reason: string): Promise<void> => {
        await apiClient.post(`${SUBORDER_API}/${subOrderId}/refund`, { reason });
    }
};
