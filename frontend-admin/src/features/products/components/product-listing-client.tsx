"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "./product-tables/columns";
import { ProductTable } from "./product-tables";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";

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
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const { items: products, pagination, loading } = useAppSelector((state) => state.products);
  const totalItems = pagination.totalElements;

  const initialPage = Number(
    searchParams?.page ?? urlSearchParams.get("page") ?? 0
  );
  const initialPerPage = Number(
    searchParams?.perPage ?? urlSearchParams.get("perPage") ?? 10
  );

  const [page, setPage] = useState(0); // Always start from page 0
  const [perPage, setPerPage] = useState(initialPerPage);

  useEffect(() => {
    if (!session?.accessToken) return;

    dispatch(fetchProducts({
      token: session.accessToken,
      params: {
        ...searchParams,
        page: page,
        size: perPage,
      }
    }));
  }, [dispatch, session, page, perPage, searchParams]);

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

  if (loading && products.length === 0) return <div>Loading products...</div>;
  // if (!products || products.length === 0) return <div>No products found.</div>; 
  // Better to show empty table than just text if loading is done

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
