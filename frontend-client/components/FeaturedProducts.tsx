"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";

export function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, perPage: 50 }));
  }, [dispatch]);

  if (loading && products.length === 0) {
    return (
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-2">Handpicked for you.</p>
          </div>
        </div>
        <p className="text-muted-foreground text-center py-12">
          Loading products...
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-16 md:py-24 px-4 md:px-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-muted-foreground mt-2">Handpicked for you.</p>
        </div>
        <a
          href="/products"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          View all products
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              firstVariant={product.firstVariant} slug={product.slug} />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            No products available
          </p>
        )}
      </div>
    </section>
  );
}
