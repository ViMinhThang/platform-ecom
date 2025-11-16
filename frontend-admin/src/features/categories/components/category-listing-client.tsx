"use client";
import { CategoryTable } from "./category-tables";
import { columns } from "./category-tables/columns";
import { useEffect, useState } from "react";
import { useCategoryContext } from "@/providers/category-provider";
interface CategoryListingClient {
  searchParams?: {
    page: number;
    perPage: number;
    name: string | null;
    category: string | null;
  };
}
export default function CategoryListingClient({
  searchParams,
}: CategoryListingClient) {
  const { fetchCategories, categories, totalItems, loading } =
    useCategoryContext();
  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );
  const filters = {
    page,
    perPage: perPage,
  };

  useEffect(() => {
    fetchCategories(filters);
  }, [fetchCategories, page, perPage]);
  if (!categories || categories.length === 0)
    return <div>No categories found.</div>;

  return (
    <CategoryTable
      data={categories}
      totalItems={totalItems}
      columns={columns}
      onPageChange={setPage}
      onPerPageChange={setPerPage}
      currentPage={page}
      pageSize={perPage}
    />
  );
}
