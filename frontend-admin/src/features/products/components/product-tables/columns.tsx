"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Text, Star } from "lucide-react";
import Image from "next/image";
import { Product, ProductRow } from "@/types/product/product";
import { CellAction } from "./cell-action";
import { formatDistanceToNow } from "date-fns";

const formatCurrency = (value: number | undefined) => {
  if (!value) return "N/A";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return "N/A";
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "DRAFT":
      return "secondary";
    case "OUT_OF_STOCK":
      return "destructive";
    default:
      return "outline";
  }
};

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
            src={`http://localhost:8080/uploads/products/${imageUrl}`}
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
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<ProductRow["name"]>()}</div>,
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
    id: "status",
    accessorKey: "status",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<ProductRow["status"]>();
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status.replace('_', ' ')}
        </Badge>
      );
    },
    meta: {
      label: "Status",
      placeholder: "Filter by status...",
      variant: "select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Draft", value: "DRAFT" },
        { label: "Out of Stock", value: "OUT_OF_STOCK" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "minPrice",
    accessorKey: "minPrice",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ cell }) => {
      const price = cell.getValue<number>();
      return <div className="font-medium">{formatCurrency(price)}</div>;
    },
  },
  {
    id: "variants",
    accessorKey: "variants",
    header: "VARIANTS",
    cell: ({ cell }) => <div>{cell.getValue<number>()}</div>,
  },
  {
    id: "totalSold",
    accessorKey: "totalSold",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Sold" />
    ),
    cell: ({ cell }) => {
      const sold = cell.getValue<number>() || 0;
      return <div className="text-center">{sold.toLocaleString()}</div>;
    },
  },
  {
    id: "rating",
    accessorKey: "averageRating",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ cell, row }) => {
      const rating = cell.getValue<number>() || 0;
      const reviews = row.original.totalReviews || 0;
      return (
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue<string>();
      return <div className="text-xs text-muted-foreground">{formatDate(date)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
