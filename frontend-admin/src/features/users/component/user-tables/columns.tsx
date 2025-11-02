"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { User } from "@/constants/data";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle } from "lucide-react";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<User>[] = [
   {
    accessorKey: "id",
    header: "id",
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search user...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
    {
    id: "email",
    accessorKey: "email",
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title="email" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User["email"]>()}</div>,
    meta: {
      label: "email",
      placeholder: "Search email...",
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
