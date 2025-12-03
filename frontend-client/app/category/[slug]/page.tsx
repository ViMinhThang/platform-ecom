"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SellerGrid } from "@/components/category/SellerGrid";
import { FilterPanel } from "@/components/category/FilterPanel";
import { SortPanel } from "@/components/category/SortPanel";
import { Pagination } from "@/components/ui/Pagination";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";

interface CategoryPageProps {
    params: { slug: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const { products, loading, error, pagination } = useAppSelector(
        (state) => state.products
    );

    const categorySlug = decodeURIComponent(params.slug);

    // Extract all filter params from URL
    const page = Number(searchParams.get("page")) || 0;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const minPrice = searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined;
    const maxPrice = searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined;
    const minRating = searchParams.get("minRating")
        ? Number(searchParams.get("minRating"))
        : undefined;

    useEffect(() => {
        dispatch(
            fetchProducts({
                page,
                perPage: 12,
                category: categorySlug,
                sortBy,
                sortOrder,
                minPrice,
                maxPrice,
                minRating,
            })
        );
    }, [dispatch, categorySlug, page, sortBy, sortOrder, minPrice, maxPrice, minRating]);

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            {/* Top Section: Seller Grid */}
            <SellerGrid />

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight capitalize">
                    {categorySlug}
                </h1>
                <p className="text-muted-foreground mt-2">
                    Explore the best products in {categorySlug}
                </p>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                {/* Left Sidebar: Filter Panel */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-24">
                        <FilterPanel />
                    </div>
                </aside>

                {/* Right Content: Product List */}
                <main className="flex-1">
                    <SortPanel totalResults={pagination.totalElements} />

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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id.toString()}
                                        name={product.name}
                                        price={product.minPrice || 0}
                                        image={product.imageUrl || "https://placehold.co/600x400"}
                                        category={product.category.name}
                                        isNew={false}
                                        firstVariant={product.firstVariant}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={pagination.pageNumber}
                                totalPages={pagination.totalPages}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">
                                No products found in this category.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
