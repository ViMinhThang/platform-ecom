"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";

import { Suspense } from "react";

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { products, loading, error, pagination } = useAppSelector(
    (state) => state.products
  );

  const page = Number(searchParams.get("page")) || 0;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        perPage: 12,
        category,
        search,
      })
    );
  }, [dispatch, page, category, search]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {category ? `${category} Products` : "All Products"}
        </h1>
        <p className="text-muted-foreground mt-2">Discover our collection</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={product.minPrice || 0}
                image={product.imageUrl || "https://placehold.co/600x400"}
                category={product.category.name}
                isNew={false}
                firstVariant={product.firstVariant} slug={product.slug} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="text-sm text-muted-foreground">
                Page {pagination.pageNumber + 1} of {pagination.totalPages}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
