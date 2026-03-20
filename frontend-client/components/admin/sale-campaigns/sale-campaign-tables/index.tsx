'use client';

import { GenericFeatureTable } from '@/components/ui/table/generic-feature-table';
import { ColumnDef } from '@tanstack/react-table';

interface SaleCampaignTableParams<TData, TValue> {
    data: TData[];
    totalItems: number;
    columns: ColumnDef<TData, TValue>[];
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    currentPage: number;
    pageSize: number;
    onRefresh?: () => void;
}

export function SaleCampaignTable<TData, TValue>(props: SaleCampaignTableParams<TData, TValue>) {
    return <GenericFeatureTable {...props} />;
}
