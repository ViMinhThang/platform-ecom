"use client";
import { CategoryTable } from "./category-tables";
import { columns } from "./category-tables/columns";
import { useState } from "react";
import { useGetCategoriesQuery } from "@/lib/store/api";

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
  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );

  const { data, isLoading } = useGetCategoriesQuery({
    page,
    size: perPage,
    search: searchParams?.name || undefined,
  });

  const categories = data?.content || [];
  const totalItems = data?.totalElements || 0;

  if (isLoading && categories.length === 0)
    return <div>Loading categories...</div>;

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
