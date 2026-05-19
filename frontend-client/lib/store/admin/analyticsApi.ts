import { baseApi } from './baseApi';

export interface DashboardOverviewDTO {
    totalRevenue: string;
    revenueGrowth: number;
    totalOrders: number;
    orderGrowth: number;
    newCustomers: number;
    customerGrowth: number;
    activeAccounts: number;
    completedOrders: number;
    processingOrders: number;
    cancelledOrders: number;
}

export interface MonthlyRevenueDTO {
    month: number;
    monthName: string;
    revenue: string;
    orderCount: number;
}

export interface MonthlyOrdersDTO {
    month: number;
    monthName: string;
    totalOrders: number;
    completed: number;
    processing: number;
    cancelled: number;
    refunded: number;
}

export interface RecentOrderDTO {
    id: number;
    groupNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: string;
    status: string;
    createdAt: string;
}

const API_BASE = '/api/v1/admin/analytics';

export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardOverview: builder.query<DashboardOverviewDTO, number | void>({
            query: (year) => ({
                url: `${API_BASE}/overview`,
                method: 'GET',
                params: year ? { year } : {},
            }),
        }),

        getRevenueByMonth: builder.query<MonthlyRevenueDTO[], number | void>({
            query: (year) => ({
                url: `${API_BASE}/revenue-by-month`,
                method: 'GET',
                params: year ? { year } : {},
            }),
        }),

        getOrdersByMonth: builder.query<MonthlyOrdersDTO[], number | void>({
            query: (year) => ({
                url: `${API_BASE}/orders-by-month`,
                method: 'GET',
                params: year ? { year } : {},
            }),
        }),

        getRecentOrders: builder.query<RecentOrderDTO[], number>({
            query: (limit = 10) => ({
                url: `${API_BASE}/recent-orders`,
                method: 'GET',
                params: { limit },
            }),
        }),
    }),
});

export const {
    useGetDashboardOverviewQuery,
    useGetRevenueByMonthQuery,
    useGetOrdersByMonthQuery,
    useGetRecentOrdersQuery,
} = analyticsApi;
