"use client";

import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";
interface CategoryTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  currentPage: number;
  pageSize: number;
}
export function CategoryTable<TData, TValue>({
  data,
  totalItems,
  columns,
  onPageChange,
  onPerPageChange,
  currentPage,
  pageSize,
}: CategoryTableParams<TData, TValue>) {
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    initialState: {
      pagination: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    },
    shallow: false,
    debounceMs: 500,
  });

  useEffect(() => {
    table.setPageIndex(currentPage);
  }, [currentPage, table]);

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const handlePaginationChange = (updater: any) => {
    const newPageIndex =
      typeof updater === "function"
        ? updater(table.getState().pagination.pageIndex)
        : updater;
    onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPerPageChange(newPageSize);
    onPageChange(0);
  };

  return (
    <DataTable
      table={table}
      onPageChange={handlePaginationChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
