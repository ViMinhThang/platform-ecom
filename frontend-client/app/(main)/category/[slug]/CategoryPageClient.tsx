"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SellerGrid } from "@/components/category/SellerGrid";
import { FilterPanel } from "@/components/category/FilterPanel";
import { ActiveFilterBar } from "@/components/category/ActiveFilterBar";
import { SortPanel } from "@/components/category/SortPanel";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    SlidersHorizontal,
    ShoppingBag,
    MoveLeft,
    MoveRight,
} from "lucide-react";
import React from "react";
import Link from "next/link";

interface CategoryPageClientProps {
    slug: string;
}

function CategoryContent({ slug }: CategoryPageClientProps) {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const get = searchParams.get.bind(searchParams);
    const toString = searchParams.toString.bind(searchParams);

    const categorySlug = decodeURIComponent(slug);
    const displayTitle = categorySlug.replace(/-/g, " ");

    const pageParam = get("page");
    const page = pageParam ? Number(pageParam) : 0;
    const sortBy = get("sortBy") || "createdAt";
    const sortOrder = (get("sortOrder") || "desc") as "asc" | "desc";
    const minPrice = get("minPrice") ? Number(get("minPrice")) : undefined;
    const maxPrice = get("maxPrice") ? Number(get("maxPrice")) : undefined;
    const minRating = get("minRating") ? Number(get("minRating")) : undefined;
    const inStock = get("inStock") === "true";
    const sellerIds = get("sellerIds")
        ? get("sellerIds")?.split(",").map(Number)
        : undefined;

    const { data, isLoading, isError, error } = useGetProductsQuery({
        page,
        perPage: 12,
        category: categorySlug,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        sellerIds,
    });

    const products = data?.content || [];
    const pagination = data
        ? {
              pageNumber: data.pageNumber,
              totalPages: data.totalPages,
              totalElements: data.totalElements,
          }
        : { pageNumber: 0, totalPages: 0, totalElements: 0 };

    const activeFilterCount = [
        get("minPrice") && get("maxPrice"),
        get("inStock"),
        get("minRating"),
        get("sellerIds"),
    ].filter(Boolean).length;

    const handleClearFilters = useCallback(() => {
        push(window.location.pathname);
    }, [push]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            const params = new URLSearchParams(toString());
            params.set("page", newPage.toString());
            push(`${window.location.pathname}?${params.toString()}`);
        },
        [push, toString]
    );

    return (
        <div className="bg-[#F5F3F4] min-h-screen">
            <div className="container max-w-[1600px] mx-auto py-24 px-6 md:px-8">
                {/* Header */}
                <div className="mb-16 space-y-6">
                    <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                        <Link
                            href="/"
                            className="hover:text-primary transition-colors"
                        >
                            TRANG CHỦ
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">
                            {displayTitle.toUpperCase()}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-labels font-semibold text-5xl md:text-6xl uppercase tracking-tighter text-foreground">
                            {displayTitle}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                                Danh mục sản phẩm
                            </span>
                            <div className="h-px bg-foreground/10 flex-1" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                                {pagination.totalElements} SẢN PHẨM
                            </span>
                        </div>
                    </div>
                </div>

                {/* Seller Grid */}
                <div className="mb-20">
                    <SellerGrid categorySlug={categorySlug} />
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-32">
                        <div className="p-6 border border-foreground/5 bg-white/60 backdrop-blur-sm rounded-sm shadow-sm">
                            <FilterPanel categorySlug={categorySlug} />
                        </div>
                    </aside>

                    {/* Right Content */}
                    <main className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-foreground/5">
                            <div className="lg:hidden flex items-center gap-2">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="relative rounded-sm border-foreground/10 font-semibold uppercase tracking-widest h-10 px-5 font-labels"
                                        >
                                            <SlidersHorizontal className="mr-2 size-3.5" />
                                            Bộ lọc
                                            {activeFilterCount > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-1.5 size-4 p-0 flex items-center justify-center text-[8px] font-semibold rounded-full"
                                                >
                                                    {activeFilterCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-[320px] sm:w-[360px] font-labels overflow-y-auto"
                                    >
                                        <SheetHeader className="pb-6 border-b border-border/10 mb-6">
                                            <SheetTitle className="text-left font-semibold uppercase tracking-widest text-base font-labels">
                                                Bộ lọc sản phẩm
                                                {activeFilterCount > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-2 size-5 p-0 inline-flex items-center justify-center text-[9px] font-semibold rounded-full align-middle"
                                                    >
                                                        {activeFilterCount}
                                                    </Badge>
                                                )}
                                            </SheetTitle>
                                        </SheetHeader>
                                        <FilterPanel categorySlug={categorySlug} />
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <div className="flex-1 lg:flex-none">
                                <SortPanel totalResults={pagination.totalElements} />
                            </div>
                        </div>

                        {/* Active Filter Pills */}
                        <ActiveFilterBar />

                        {/* Product Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-4 animate-pulse">
                                        <div className="aspect-[4/5] bg-secondary/40 rounded-sm" />
                                        <div className="h-2 bg-secondary/40 w-1/4 rounded-sm" />
                                        <div className="h-4 bg-secondary/40 w-3/4 rounded-sm" />
                                        <div className="h-2 bg-secondary/40 w-1/3 rounded-sm" />
                                    </div>
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="text-center py-32 border border-dashed border-red-200/60 rounded-sm bg-red-50/20">
                                <div className="size-12 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                                    <ShoppingBag className="size-5 text-red-300" strokeWidth={1.5} />
                                </div>
                                <p className="text-red-400 font-semibold uppercase tracking-widest text-[10px] font-labels">
                                    {error
                                        ? String(error)
                                        : "Lỗi truy xuất danh mục"}
                                </p>
                                <Button
                                    onClick={handleClearFilters}
                                    variant="outline"
                                    size="sm"
                                    className="mt-6 rounded-sm border-red-200/40 text-red-400 text-[10px] font-semibold uppercase tracking-widest hover:bg-red-50"
                                >
                                    Thử lại
                                </Button>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id.toString()}
                                            slug={product.slug || `product-${product.id}`}
                                            name={product.name}
                                            price={product.minPrice || 0}
                                            image={product.imageUrl || ""}
                                            category={categorySlug}
                                            firstVariant={product.firstVariant}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="mt-24 flex items-center justify-between border-t border-foreground/5 pt-12">
                                        <button
                                            disabled={pagination.pageNumber === 0}
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.pageNumber - 1
                                                )
                                            }
                                            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest disabled:opacity-20 hover:text-primary transition-all font-labels cursor-pointer"
                                        >
                                            <MoveLeft className="size-3.5" />
                                            Trang trước
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({
                                                length: pagination.totalPages,
                                            }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() =>
                                                        handlePageChange(i)
                                                    }
                                                    className={`size-8 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider rounded-sm transition-all duration-150 cursor-pointer ${
                                                        i === pagination.pageNumber
                                                            ? "bg-foreground text-background"
                                                            : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            disabled={
                                                pagination.pageNumber + 1 >=
                                                pagination.totalPages
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.pageNumber + 1
                                                )
                                            }
                                            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest disabled:opacity-20 hover:text-primary transition-all font-labels cursor-pointer"
                                        >
                                            Trang tiếp
                                            <MoveRight className="size-3.5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-32 border border-dashed border-foreground/10 rounded-sm bg-white/30">
                                <div className="size-16 mx-auto mb-8 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <ShoppingBag
                                        className="size-6 text-foreground/20"
                                        strokeWidth={1}
                                    />
                                </div>
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/60 mb-3 font-labels">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/30 mb-8 max-w-xs mx-auto leading-relaxed font-labels">
                                    Vui lòng điều chỉnh bộ lọc sản phẩm để mở
                                    rộng phạm vi tìm kiếm.
                                </p>
                                <Button
                                    onClick={handleClearFilters}
                                    variant="outline"
                                    className="rounded-sm border-foreground/10 text-foreground text-[10px] font-semibold uppercase tracking-widest px-10 h-11 hover:bg-foreground hover:text-white transition-all font-labels"
                                >
                                    Xóa tất cả bộ lọc
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
    return (
        <Suspense
            fallback={
                <div className="bg-[#F5F3F4] min-h-screen">
                    <div className="container max-w-[1600px] mx-auto py-24 px-6 md:px-8">
                        <div className="animate-pulse space-y-8">
                            <div className="h-4 bg-secondary/40 w-48 rounded-sm" />
                            <div className="h-12 bg-secondary/40 w-96 rounded-sm" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mt-20">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="aspect-[4/5] bg-secondary/40 rounded-sm" />
                                        <div className="h-2 bg-secondary/40 w-1/4 rounded-sm" />
                                        <div className="h-4 bg-secondary/40 w-3/4 rounded-sm" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <CategoryContent slug={slug} />
        </Suspense>
    );
}
