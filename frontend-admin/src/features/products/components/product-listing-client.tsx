"use client";

import { useEffect, useState } from "react";
import { ProductDialog } from "./product-form/product-form";
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

export const ProductListingClient: React.FC<ProductListingClientProps> = ({ token, searchParams }) => {

  const { fetchProducts, products, totalItems, loading } = useProductContext();


  useEffect(() => {
    fetchProducts?.(token, searchParams); 
  }, [fetchProducts, token, searchParams]);

  if (loading) return <div>Loading products...</div>;
  if (!products || products.length === 0) return <div>No products found.</div>;

  return (
    <>
      <ProductTable data={products} totalItems={totalItems} columns={columns}  />
    </>
  );
};
