"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Text } from "lucide-react";
import Image from "next/image";
import { Product, ProductRow } from "@/types/product";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<ProductRow>[] = [
  {
    id: "image",
    header: "IMAGE",
    cell: ({ row }) => {
      const ProductRow = row.original;
      const imageUrl = ProductRow.imageUrl || "/placeholder.png";

      return (
        <div className="relative w-16 h-16">
          <Image
            src={`http://localhost:8080/uploads/${imageUrl}`}
            alt={ProductRow.name}
            fill
            className="object-cover rounded-md border"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<ProductRow["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search products...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ cell }) => {
      const category = cell.getValue<ProductRow["category"]>();
      return (
        <Badge variant="outline" className="capitalize">
          {category?.name}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "variants",
    accessorKey: "variants",
    header: "VARIANTS",
    cell: ({ cell }) => <div>{cell.getValue<number>()}</div>, // variants is a number now
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
