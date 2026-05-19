"use client";

import { GenericFeatureTable } from "@/components/ui/table/generic-feature-table";
import { ColumnDef } from "@tanstack/react-table";

interface UserTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  currentPage: number;
  pageSize: number;
}

export function UserTable<TData, TValue>(props: UserTableParams<TData, TValue>) {
  return <GenericFeatureTable {...props} />;
}
