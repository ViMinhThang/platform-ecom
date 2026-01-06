'use client';

import { useState, useEffect, useCallback } from 'react';
import { FlashSale, FlashSaleResponse, CreateFlashSaleRequest, UpdateFlashSaleRequest, AddFlashSaleItemRequest } from '@/types/flash-sale';
import { flashSaleService } from '@/lib/services/flash-sale-service';
import { toast } from 'sonner';

interface UseFlashSalesParams {
    page?: number;
    size?: number;
    status?: string;
}

export function useFlashSales(params: UseFlashSalesParams = {}) {
    const [data, setData] = useState<FlashSaleResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchFlashSales = useCallback(async () => {
        setLoading(true);
        try {
            const response = await flashSaleService.getAll(params);
            setData(response);
            setError(null);
        } catch (err) {
            setError(err as Error);
            toast.error('Failed to fetch flash sales');
        } finally {
            setLoading(false);
        }
    }, [params.page, params.size, params.status]);

    useEffect(() => {
        fetchFlashSales();
    }, [fetchFlashSales]);

    return { data, loading, error, refetch: fetchFlashSales };
}

export function useFlashSale(id: number | null) {
    const [data, setData] = useState<FlashSale | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setData(null);
            return;
        }

        const fetchFlashSale = async () => {
            setLoading(true);
            try {
                const response = await flashSaleService.getById(id);
                setData(response);
                setError(null);
            } catch (err) {
                setError(err as Error);
                toast.error('Failed to fetch flash sale');
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSale();
    }, [id]);

    return { data, loading, error };
}

export function useFlashSaleMutations() {
    const [loading, setLoading] = useState(false);

    const createFlashSale = async (data: CreateFlashSaleRequest): Promise<FlashSale | null> => {
        setLoading(true);
        try {
            const result = await flashSaleService.create(data);
            toast.success('Flash sale created successfully');
            return result;
        } catch (err) {
            toast.error('Failed to create flash sale');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateFlashSale = async (id: number, data: UpdateFlashSaleRequest): Promise<FlashSale | null> => {
        setLoading(true);
        try {
            const result = await flashSaleService.update(id, data);
            toast.success('Flash sale updated successfully');
            return result;
        } catch (err) {
            toast.error('Failed to update flash sale');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteFlashSale = async (id: number): Promise<boolean> => {
        setLoading(true);
        try {
            await flashSaleService.delete(id);
            toast.success('Flash sale deleted successfully');
            return true;
        } catch (err) {
            toast.error('Failed to delete flash sale');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const activateFlashSale = async (id: number): Promise<FlashSale | null> => {
        setLoading(true);
        try {
            const result = await flashSaleService.activate(id);
            toast.success('Flash sale activated successfully');
            return result;
        } catch (err) {
            toast.error('Failed to activate flash sale');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const cancelFlashSale = async (id: number): Promise<FlashSale | null> => {
        setLoading(true);
        try {
            const result = await flashSaleService.cancel(id);
            toast.success('Flash sale cancelled successfully');
            return result;
        } catch (err) {
            toast.error('Failed to cancel flash sale');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addItems = async (id: number, items: AddFlashSaleItemRequest[]): Promise<FlashSale | null> => {
        setLoading(true);
        try {
            const result = await flashSaleService.addItems(id, items);
            toast.success('Items added successfully');
            return result;
        } catch (err) {
            toast.error('Failed to add items');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (flashSaleId: number, itemId: number): Promise<FlashSale | null> => {
        setLoading(true);
        try {
            const result = await flashSaleService.removeItem(flashSaleId, itemId);
            toast.success('Item removed successfully');
            return result;
        } catch (err) {
            toast.error('Failed to remove item');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createFlashSale,
        updateFlashSale,
        deleteFlashSale,
        activateFlashSale,
        cancelFlashSale,
        addItems,
        removeItem,
    };
}
