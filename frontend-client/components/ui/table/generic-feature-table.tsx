'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef, Table } from '@tanstack/react-table';
import { useEffect, ReactNode } from 'react';

interface GenericFeatureTableProps<TData, TValue> {
    data: TData[];
    totalItems: number;
    columns: ColumnDef<TData, TValue>[];
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    currentPage: number;
    pageSize: number;
    toolbar?: ReactNode | ((table: Table<TData>) => ReactNode);
    showDefaultToolbar?: boolean;
}

export function GenericFeatureTable<TData, TValue>({
    data,
    totalItems,
    columns,
    onPageChange,
    onPerPageChange,
    currentPage,
    pageSize,
    toolbar,
    showDefaultToolbar = true,
}: GenericFeatureTableProps<TData, TValue>) {
    const pageCount = Math.ceil(totalItems / pageSize);

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        initialState: {
            pagination: { pageIndex: currentPage, pageSize },
        },
        shallow: false,
        debounceMs: 500,
    });

    // Sync external page state → table
    useEffect(() => {
        table.setPageIndex(currentPage);
    }, [currentPage, table]);

    // Sync external perPage → table
    useEffect(() => {
        table.setPageSize(pageSize);
    }, [pageSize, table]);

    const handlePaginationChange = (updater: unknown) => {
        const newPageIndex =
            typeof updater === 'function'
                ? updater(table.getState().pagination.pageIndex)
                : updater;
        onPageChange(newPageIndex as number);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        onPerPageChange(newPageSize);
        onPageChange(0); // Reset to first page when size changes
    };

    const toolbarContent = toolbar
        ? typeof toolbar === 'function' ? toolbar(table) : toolbar
        : showDefaultToolbar ? <DataTableToolbar table={table} /> : null;

    return (
        <DataTable
            table={table}
            onPageChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
        >
            {toolbarContent}
        </DataTable>
    );
}
