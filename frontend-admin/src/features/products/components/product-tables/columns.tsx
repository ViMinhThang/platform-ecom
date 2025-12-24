"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { ColumnDef, Column } from "@tanstack/react-table";
import { Text, Star } from "lucide-react";
import Image from "next/image";
import { Product, ProductRow } from "@/types/product/product";
import { CellAction } from "./cell-action";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

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
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Hoạt động";
    case "DRAFT":
      return "Bản nháp";
    case "OUT_OF_STOCK":
      return "Hết hàng";
    default:
      return status;
  }
};

export const columns: ColumnDef<ProductRow>[] = [
  {
    id: "image",
    header: "HÌNH ẢNH",
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
      <DataTableColumnHeader column={column} title="Tên sản phẩm" />
    ),
    cell: ({ cell }) => <div className="font-medium">{cell.getValue<ProductRow["name"]>()}</div>,
    meta: {
      label: "Tên sản phẩm",
      placeholder: "Tìm kiếm sản phẩm...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Danh mục" />
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
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<ProductRow["status"]>();
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {getStatusLabel(status)}
        </Badge>
      );
    },
    meta: {
      label: "Trạng thái",
      placeholder: "Lọc theo trạng thái...",
      variant: "select",
      options: [
        { label: "Hoạt động", value: "ACTIVE" },
        { label: "Bản nháp", value: "DRAFT" },
        { label: "Hết hàng", value: "OUT_OF_STOCK" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "minPrice",
    accessorKey: "minPrice",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Giá" />
    ),
    cell: ({ cell }) => {
      const price = cell.getValue<number>();
      return <div className="font-medium">{formatCurrency(price)}</div>;
    },
  },
  {
    id: "variants",
    accessorKey: "variants",
    header: "BIẾN THỂ",
    cell: ({ cell }) => <div>{cell.getValue<number>()}</div>,
  },
  {
    id: "totalSold",
    accessorKey: "totalSold",
    header: ({ column }: { column: Column<ProductRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Đã bán" />
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
      <DataTableColumnHeader column={column} title="Đánh giá" />
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
      <DataTableColumnHeader column={column} title="Ngày tạo" />
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
