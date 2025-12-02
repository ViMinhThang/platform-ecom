import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchOrders,
    fetchOrderById,
    cancelOrder
} from '@/lib/store/slices/orderSlice';

export const useOrders = () => {
    const dispatch = useAppDispatch();
    const { orders, currentOrder, loading, error, page, totalPages } = useAppSelector((state) => state.orders);

    const loadOrders = (page = 0, size = 10) => {
        dispatch(fetchOrders({ page, size }));
    };

    const loadOrderDetails = (orderId: number) => {
        dispatch(fetchOrderById(orderId));
    };

    const cancel = async (orderId: number) => {
        await dispatch(cancelOrder(orderId)).unwrap();
    };

    return {
        orders,
        currentOrder,
        loading,
        error,
        page,
        totalPages,
        loadOrders,
        loadOrderDetails,
        cancel
    };
};
