import { useGetOrdersQuery, useGetOrderByIdQuery, useCancelOrderMutation } from '@/lib/store/api/clientApi';
import type { OrderGroupDTO } from '@/types/order.types';

export interface UseOrdersReturn {
    orders: OrderGroupDTO[];
    currentOrder: OrderGroupDTO | null;
    loading: boolean;
    error: unknown;
    page: number;
    totalPages: number;
    loadOrders: (page?: number, size?: number) => void;
    loadOrderDetails: (orderId: number) => void;
    cancel: (orderId: number) => Promise<void>;
    refetchOrders: () => void;
    refetchOrderDetails: () => void;
}

export const useOrders = (): UseOrdersReturn => {
    const [cancelOrderMutation] = useCancelOrderMutation();

    const {
        data: ordersData,
        isLoading,
        error,
        refetch: refetchOrders
    } = useGetOrdersQuery({ page: 0, size: 10 });

    const {
        data: currentOrder,
        refetch: refetchOrderDetails
    } = useGetOrderByIdQuery(0, { skip: true });

    const orders = ordersData?.content || [];
    const page = ordersData?.page || 0;
    const totalPages = ordersData?.totalPages || 0;

    const loadOrders = (page = 0, size = 10) => {
        refetchOrders();
    };

    const loadOrderDetails = (orderId: number) => {
        refetchOrderDetails();
    };

    const cancel = async (orderId: number) => {
        await cancelOrderMutation(orderId).unwrap();
        refetchOrders();
    };

    return {
        orders,
        currentOrder: null,
        loading: isLoading,
        error,
        page,
        totalPages,
        loadOrders,
        loadOrderDetails,
        cancel,
        refetchOrders,
        refetchOrderDetails,
    };
};

export interface UseOrderDetailReturn {
    order: OrderGroupDTO | undefined;
    loading: boolean;
    error: unknown;
    cancel: (orderId: number) => Promise<void>;
}

export const useOrderDetail = (orderId: number): UseOrderDetailReturn => {
    const [cancelOrderMutation] = useCancelOrderMutation();
    const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);

    const cancel = async (id: number) => {
        await cancelOrderMutation(id).unwrap();
    };

    return {
        order,
        loading: isLoading,
        error,
        cancel,
    };
};
