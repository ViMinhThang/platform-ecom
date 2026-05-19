import { useGetProductsQuery } from '@/lib/store/api/clientApi';
import type { ProductRow, ProductResponse } from '@/types/product';
import type { GetProductsParams } from '@/lib/services/product-service';

export interface UseProductsReturn {
    products: ProductRow[];
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        lastPage: boolean;
    };
    loading: boolean;
    error: unknown;
    refetch: () => void;
}

export const useProducts = (params?: GetProductsParams): UseProductsReturn => {
    const { data, isLoading, error, refetch } = useGetProductsQuery(params || {});

    const products = data?.content || [];
    const pagination = data ? {
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        lastPage: data.lastPage,
    } : {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    };

    return {
        products,
        pagination,
        loading: isLoading,
        error,
        refetch,
    };
};
