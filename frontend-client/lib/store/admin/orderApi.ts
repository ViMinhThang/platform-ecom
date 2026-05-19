import { baseApi } from './baseApi';
import { AdminOrderGroup, AdminSubOrder, OrderFilterRequest, TrackingUpdateRequest } from '@/types/order/order';

export type { OrderFilterRequest };

export interface OrdersResponse {
    content: AdminOrderGroup[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

const API_BASE = '/api/v1/admin/orders';

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<OrdersResponse, OrderFilterRequest>({
            query: (params) => ({
                url: API_BASE,
                method: 'GET',
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
            }),
            providesTags: (result) =>
                result?.content
                    ? [
                          { type: 'AdminOrder', id: 'LIST' },
                          ...result.content.map(({ id }) => ({ type: 'AdminOrder' as const, id })),
                      ]
                    : [{ type: 'AdminOrder', id: 'LIST' }],
        }),

        getOrderDetails: builder.query<AdminOrderGroup, number>({
            query: (groupId) => ({
                url: `${API_BASE}/${groupId}`,
                method: 'GET',
            }),
            providesTags: (result, error, groupId) => [{ type: 'AdminOrder', id: groupId }],
        }),

        updateOrderStatus: builder.mutation<AdminOrderGroup, { groupId: number; status: string; notes?: string }>({
            query: ({ groupId, status, notes }) => ({
                url: `${API_BASE}/${groupId}/status`,
                method: 'PUT',
                params: { status, notes },
            }),
            invalidatesTags: (result, error, { groupId }) => [
                { type: 'AdminOrder', id: groupId },
                { type: 'AdminOrder', id: 'LIST' },
            ],
        }),

        updateSubOrderStatus: builder.mutation<AdminSubOrder, { groupId: number; subOrderId: number; status: string; notes?: string }>({
            query: ({ groupId, subOrderId, status, notes }) => ({
                url: `${API_BASE}/${groupId}/sub-orders/${subOrderId}/status`,
                method: 'PUT',
                params: { status, notes },
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: 'AdminOrder', id: groupId }],
        }),

        updateSubOrderTracking: builder.mutation<AdminSubOrder, { groupId: number; subOrderId: number; data: TrackingUpdateRequest }>({
            query: ({ groupId, subOrderId, data }) => ({
                url: `${API_BASE}/${groupId}/sub-orders/${subOrderId}/tracking`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: 'AdminOrder', id: groupId }],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderDetailsQuery,
    useUpdateOrderStatusMutation,
    useUpdateSubOrderStatusMutation,
    useUpdateSubOrderTrackingMutation,
} = orderApi;
