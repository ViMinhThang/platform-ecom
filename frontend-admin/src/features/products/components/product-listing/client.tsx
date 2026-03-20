"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "../product-tables/columns";
import { ProductTable } from "../product-tables";
import { useGetProductsQuery } from "@/lib/store/api";

interface ProductListingClientProps {
  searchParams?: {
    page?: string;
    perPage?: string;
    name?: string;
    category?: string;
  };
}

export const ProductListingClient: React.FC<ProductListingClientProps> = ({
  searchParams,
}) => {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const initialPage = Number(
    searchParams?.page ?? urlSearchParams.get("page") ?? 0
  );
  const initialPerPage = Number(
    searchParams?.perPage ?? urlSearchParams.get("perPage") ?? 10
  );

  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const { data, isLoading } = useGetProductsQuery({
    page,
    size: perPage,
    search: searchParams?.name,
  });

  const products = data?.content || [];
  const totalItems = data?.totalElements || 0;

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

    router.replace(`/admin/dashboard/product?${params.toString()}`);
  }, [page, perPage, searchParams, router]);

  if (isLoading && products.length === 0) return <div>Đang tải sản phẩm...</div>;

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
