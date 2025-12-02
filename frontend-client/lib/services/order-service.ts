import apiClient from '@/lib/api-client';
import { Order, ApiResponse, PaginatedResponse } from '@/types/user';

export interface OrderRequest {
    addressId: number;
    pgName?: string;
    pgPaymentId?: string;
    pgStatus?: string;
    pgResponseMessage?: string;
}

export interface OrderResponse {
    content: Order[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}

/**
 * Place new order
 */
export const placeOrder = async (
    paymentMethod: string,
    orderRequest: OrderRequest,
    token: string
): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
        `/orders/users/payments/${paymentMethod}`,
        orderRequest,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Get user's order history
 */
export const getUserOrders = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    sortBy: string = 'orderDate',
    sortOrder: string = 'desc',
    token: string
): Promise<OrderResponse> => {
    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
    });

    const response = await apiClient.get<ApiResponse<OrderResponse>>(
        `/orders/user/history?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: number, token: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
        `/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};
