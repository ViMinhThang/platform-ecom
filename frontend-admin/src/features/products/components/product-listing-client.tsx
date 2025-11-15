"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "./product-tables/columns";
import { useProductContext } from "@/providers/product-provider";
import { ProductTable } from "./product-tables";

interface ProductListingClientProps {
  token: string;
  searchParams?: {
    page?: string;
    perPage?: string;
    name?: string;
    category?: string;
  };
}

export const ProductListingClient: React.FC<ProductListingClientProps> = ({
  token,
  searchParams,
}) => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const initialPage = Number(searchParams?.page ?? urlSearchParams.get("page") ?? 0);
  const initialPerPage = Number(searchParams?.perPage ?? urlSearchParams.get("perPage") ?? 10);

  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const { fetchProducts, products, totalItems, loading } = useProductContext();

  useEffect(() => {
    fetchProducts?.(token, {
      ...searchParams,
      page: page.toString(),
      perPage: perPage.toString(),
    });
  }, [fetchProducts, token, page, perPage, searchParams]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", perPage.toString());
    if (searchParams?.name) params.set("name", searchParams.name);
    if (searchParams?.category) params.set("category", searchParams.category);

    router.replace(`/dashboard/product?${params.toString()}`);
  }, [page, perPage, searchParams, router]);

  if (loading) return <div>Loading products...</div>;
  if (!products || products.length === 0) return <div>No products found.</div>;

  return (
    <ProductTable
      data={products}
      totalItems={totalItems}
      columns={columns}
      onPageChange={setPage}
      onPerPageChange={setPerPage}
      currentPage={page}
      pageSize={perPage}
    />
  );
};
