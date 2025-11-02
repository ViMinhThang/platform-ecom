"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Category, Product } from "@/constants/data";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle } from "lucide-react";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Category>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Category["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search category...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "created_at",
    header: "created at",
  },
  {
    accessorKey: "updated_at",
    header: "updated at",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
