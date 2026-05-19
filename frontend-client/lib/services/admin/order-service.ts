import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/constants';
import {
    AdminOrderGroup,
    AdminSubOrder,
    OrderFilterRequest,
    TrackingUpdateRequest
} from '@/types/order/order';
import { APIResponse } from '@/types/api-response';

export interface OrdersResponse {
    content: AdminOrderGroup[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const orderService = {
    getOrders: async (params: OrderFilterRequest) => {
        const response = await apiClient.get<APIResponse<OrdersResponse>>(API_ENDPOINTS.ADMIN_ORDERS, {
            params: {
                page: params.page,
                size: params.size,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                groupNumber: params.groupNumber,
                overallStatus: params.overallStatus,
                paymentStatus: params.paymentStatus,
                startDate: params.startDate,
                endDate: params.endDate,
                minAmount: params.minAmount,
                maxAmount: params.maxAmount,
                sellerName: params.sellerName,
            },
        });
        return response.data.data;
    },

    getOrderDetails: async (groupId: number) => {
        const response = await apiClient.get<APIResponse<AdminOrderGroup>>(
            `${API_ENDPOINTS.ADMIN_ORDERS}/${groupId}`
        );
        return response.data.data;
    },

    updateOrderStatus: async (groupId: number, status: string, notes?: string) => {
        const response = await apiClient.put<APIResponse<AdminOrderGroup>>(
            `${API_ENDPOINTS.ADMIN_ORDERS}/${groupId}/status`,
            null,
            {
                params: { status, notes },
            }
        );
        return response.data.data;
    },

    updateSubOrderStatus: async (
        groupId: number,
        subOrderId: number,
        status: string,
        notes?: string
    ) => {
        const response = await apiClient.put<APIResponse<AdminSubOrder>>(
            `${API_ENDPOINTS.ADMIN_ORDERS}/${groupId}/sub-orders/${subOrderId}/status`,
            null,
            {
                params: { status, notes },
            }
        );
        return response.data.data;
    },

    updateSubOrderTracking: async (
        groupId: number,
        subOrderId: number,
        data: TrackingUpdateRequest
    ) => {
        const response = await apiClient.put<APIResponse<AdminSubOrder>>(
            `${API_ENDPOINTS.ADMIN_ORDERS}/${groupId}/sub-orders/${subOrderId}/tracking`,
            data
        );
        return response.data.data;
    }
};
