import type { Category } from "@/types/Category";
import type { ColumnDef } from "@tanstack/react-table";

export const categoriesColumns: ColumnDef<Category>[] = [
  { accessorKey: "categoryId", header: "Id" },
  { accessorKey: "categoryName", header: "Name" },
];
