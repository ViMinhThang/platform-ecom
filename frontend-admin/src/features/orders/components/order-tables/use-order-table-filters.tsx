'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useOrderTableFilters() {
    const [searchQuery, setSearchQuery] = useQueryState(
        'q',
        searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault('')
    );

    const [page, setPage] = useQueryState(
        'page',
        searchParams.page.withDefault(1)
    );

    const [limit, setLimit] = useQueryState(
        'limit',
        searchParams.limit.withDefault(10)
    );

    const [status, setStatus] = useQueryState(
        'status',
        searchParams.status.withOptions({ shallow: false }).withDefault('')
    );

    const resetFilters = useCallback(() => {
        setSearchQuery(null);
        setStatus(null);
        setPage(1);
    }, [setSearchQuery, setStatus, setPage]);

    const isAnyFilterActive = useMemo(() => {
        return !!searchQuery || !!status;
    }, [searchQuery, status]);

    return {
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        limit,
        setLimit,
        status,
        setStatus,
        resetFilters,
        isAnyFilterActive,
    };
}
