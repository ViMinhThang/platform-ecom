import type { Product } from "@/types/Product";
import type { ColumnDef } from "@tanstack/react-table";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${(row.getValue("price") as number).toFixed(2)}`,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => `${row.getValue("discount")}%`,
  },
  {
    accessorKey: "specialPrice",
    header: "Special Price",
    cell: ({ row }) =>
      `$${(row.getValue("specialPrice") as number).toFixed(2)}`,
  },
];
