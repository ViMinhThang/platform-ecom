'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface FlashSaleTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageNo: number;
    pageSize?: number;
    pageCount: number;
    loading?: boolean;
    onPageChange?: (page: number) => void;
}

export function FlashSaleTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pageNo,
    pageSize = 10,
    loading,
    onPageChange,
}: FlashSaleTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualFiltering: true,
        state: {
            pagination: {
                pageIndex: pageNo,
                pageSize: pageSize,
            }
        }
    });

    const handlePageChange = (updater: any) => {
        const newState = typeof updater === 'function'
            ? updater({ pageIndex: pageNo, pageSize })
            : updater;
        onPageChange?.(newState.pageIndex);
    };

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ScrollArea className="rounded-md">
                <Table className="relative">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-black text-xs uppercase tracking-wider">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No flash sales found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <DataTablePagination
                table={table}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
