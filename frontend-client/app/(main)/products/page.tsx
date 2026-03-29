"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { Suspense } from "react";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  
  const page = Number(searchParams.get("page")) || 0;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

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

  return (
    <div className="bg-[#F5F3F4] min-h-screen">
      <div className="container max-w-[1600px] mx-auto py-24 px-6 md:px-8">
        <div className="mb-20 space-y-4">
          <h1 className="font-labels font-bold text-5xl uppercase tracking-tight text-foreground">
            {category ? `${category}` : search ? `Tìm kiếm: ${search}` : "Tất cả sản phẩm"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">Danh mục lưu trữ</span>
            <div className="h-px bg-foreground/10 flex-1" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">{products.length} SẢN PHẨM</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-secondary/50 rounded-sm" />
                <div className="h-2 bg-secondary/50 w-1/4" />
                <div className="h-4 bg-secondary/50 w-3/4" />
                <div className="h-4 bg-secondary/50 w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-32">
            <p className="text-red-500 font-bold uppercase tracking-widest text-xs font-labels">{error ? String(error) : 'Lỗi truy xuất hồ sơ'}</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-32 flex justify-center border-t border-foreground/5 pt-16">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                  TRANG {pagination.pageNumber + 1} / {pagination.totalPages}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 border border-dashed border-foreground/10 rounded-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 font-labels">Không tìm thấy vật phẩm phù hợp trong hồ sơ</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F3F4] animate-pulse" />}>
      <ProductsPageContent />
    </Suspense>
  );
}
