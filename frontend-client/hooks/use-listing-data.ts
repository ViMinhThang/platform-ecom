'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { AsyncThunk } from '@reduxjs/toolkit';

interface UseListingDataOptions<TParams> {
    /**
     * The async thunk action to dispatch for fetching data
     */
    fetchAction: AsyncThunk<unknown, TParams, object>;

    /**
     * Function to build the parameters for the fetch action
     */
    buildParams: (page: number, perPage: number) => TParams;

    /**
     * Initial page number (default: 0)
     */
    initialPage?: number;

    /**
     * Initial items per page (default: 10)
     */
    initialPerPage?: number;

    /**
     * Additional dependencies that should trigger a refetch
     */
    dependencies?: unknown[];

    /**
     * Whether to fetch data automatically on mount (default: true)
     */
    autoFetch?: boolean;
}

interface UseListingDataReturn {
    page: number;
    perPage: number;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    refresh: () => void;
}

/**
 * A custom hook to standardize listing data fetching and pagination across feature modules.
 * 
 * @example
 * ```tsx
 * const { page, perPage, setPage, setPerPage, refresh } = useListingData({
 *   fetchAction: fetchProducts,
 *   buildParams: (page, perPage) => ({
 *     token: session.accessToken,
 *     params: { page, size: perPage }
 *   }),
 *   dependencies: [session?.accessToken],
 * });
 * ```
 */
export function useListingData<TParams>({
    fetchAction,
    buildParams,
    initialPage = 0,
    initialPerPage = 10,
    dependencies = [],
    autoFetch = true,
}: UseListingDataOptions<TParams>): UseListingDataReturn {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(initialPage);
    const [perPage, setPerPage] = useState(initialPerPage);

    const refresh = useCallback(() => {
        dispatch(fetchAction(buildParams(page, perPage) as any));
    }, [dispatch, fetchAction, buildParams, page, perPage]);

    useEffect(() => {
        if (autoFetch) {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, ...dependencies]);

    const handleSetPerPage = useCallback((newPerPage: number) => {
        setPerPage(newPerPage);
        setPage(0); // Reset to first page when changing page size
    }, []);

    return {
        page,
        perPage,
        setPage,
        setPerPage: handleSetPerPage,
        refresh,
    };
}
