"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle } from "lucide-react";
import { CellAction } from "./cell-action";
import { Category } from "@/types/category/category";
import Image from "next/image";

export const columns: ColumnDef<Category>[] = [
  {
    id: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const ProductRow = row.original;
      const imageUrl = ProductRow.imageUrl || "/placeholder.png";
      return (
        <div className="relative size-16">
          <Image
            src={`http://localhost:8080/uploads/${imageUrl}`}
            alt={ProductRow.name}
            fill
            sizes="40px"
            className="object-cover rounded-md border"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Category, unknown> }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Category["name"]>()}</div>,
    meta: {
      label: "Tên",
      placeholder: "Tìm danh mục...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
