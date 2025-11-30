"use client";
import { CategoryTable } from "./category-tables";
import { columns } from "./category-tables/columns";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCategories } from "@/lib/store/slices/categorySlice";

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
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { items: categories, pagination, loading } = useAppSelector((state) => state.categories);
  const totalItems = pagination.totalElements;

  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );

  useEffect(() => {
    if (!session?.accessToken) return;

    dispatch(fetchCategories({
      token: session.accessToken,
      params: {
        page,
        size: perPage
      }
    }));
  }, [dispatch, session, page, perPage]);

  if (loading && categories.length === 0)
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
