"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import { Loader2 } from "lucide-react";

export function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, perPage: 20 })); // Fetching less for homepage performance
  }, [dispatch]);

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            name={product.name}
            price={product.minPrice || 0}
            image={product.imageUrl || "https://placehold.co/600x400"}
            category={product.category.name}
            isNew={false}
            firstVariant={product.firstVariant}
            slug={product.slug}
          />
        ))
      ) : (
        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            Hiện không có sản phẩm nào khả dụng.
          </p>
        </div>
      )}
    </div>
  );
}
