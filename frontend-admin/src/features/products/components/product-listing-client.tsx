"use client";

import { useEffect, useState } from "react";
import { columns } from "./product-tables/columns";
import { useProductContext } from "@/providers/product-provider";
import { ProductTable } from "./product-tables";

interface ProductListingClientProps {
  token: string;
  searchParams?: {
    page: number;
    perPage: number;
    name: string | null;
    category: string | null;
  };
}

export const ProductListingClient: React.FC<ProductListingClientProps> = ({
  token,
  searchParams,
}) => {
  const { fetchProducts, products, totalItems, loading } = useProductContext();

  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );
  useEffect(() => {
    fetchProducts?.(token, {
      ...searchParams,
      page: page.toString(),
      perPage: perPage.toString(),
    });
  }, [fetchProducts, token, page, perPage]);

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
