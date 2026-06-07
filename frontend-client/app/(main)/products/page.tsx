"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { Pagination } from "@/components/common/Pagination";
import { Suspense } from "react";

function ProductsPageContent() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const get = searchParams.get.bind(searchParams);
  const toString = searchParams.toString.bind(searchParams);
  
  const page = Number(get("page")) || 0;
  const category = get("category") || undefined;
  const search = get("search") || undefined;

  const { data, isLoading, isError, error } = useGetProductsQuery({
    page,
    perPage: 12,
    category,
    search,
  });

  const products = data?.content || [];
  const pagination = data ? {
    pageNumber: data.pageNumber,
    totalPages: data.totalPages,
  } : { pageNumber: 0, totalPages: 0 };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(toString());
    params.set("page", newPage.toString());
    push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-surface-container-low min-h-screen">
      <div className="max-w-[1600px] mx-auto py-16 md:py-24 px-6 md:px-12">
        <div className="mb-12 space-y-3">
          <h1 className="font-labels font-semibold text-3xl md:text-4xl tracking-tight text-foreground">
            {category ? `${category}` : search ? `Tìm kiếm: ${search}` : "Tất cả sản phẩm"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-foreground/50">Danh mục sản phẩm</span>
            <div className="h-px bg-foreground/10 flex-1" />
            <span className="text-xs font-medium text-foreground/50">{products.length} sản phẩm</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-square bg-surface-container rounded-lg" />
                <div className="h-2 bg-surface-container w-1/4 rounded" />
                <div className="h-4 bg-surface-container w-3/4 rounded" />
                <div className="h-4 bg-surface-container w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-32">
            <p className="text-sm text-destructive font-medium">{error ? String(error) : 'Không thể tải sản phẩm'}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    price={product.minPrice || 0}
                    image={product.imageUrl || "/placeholder.jpg"}
                    category={product.category.name}
                    firstVariant={product.firstVariant} 
                    slug={product.slug} 
                  />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-20 flex justify-center pt-10">
                <Pagination
                  currentPage={pagination.pageNumber}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-surface-container-lowest rounded-xl">
            <p className="text-sm text-foreground/40">Không tìm thấy sản phẩm phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-container-low animate-pulse" />}>
      <ProductsPageContent />
    </Suspense>
  );
}
