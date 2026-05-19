import { useGetCategoriesQuery } from '@/lib/store/api/clientApi';
import type { Category } from '@/types/product';

export interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: unknown;
    refetch: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
    const { data, isLoading, error, refetch } = useGetCategoriesQuery();

    return {
        categories: data || [],
        loading: isLoading,
        error,
        refetch,
    };
};
