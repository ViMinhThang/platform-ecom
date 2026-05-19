"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SellerGrid } from "@/components/category/SellerGrid";
import { FilterPanel } from "@/components/category/FilterPanel";
import { SortPanel } from "@/components/category/SortPanel";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ShoppingBag, MoveLeft, MoveRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface CategoryPageClientProps {
    slug: string;
}

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const categorySlug = decodeURIComponent(slug);
    const displayTitle = categorySlug.replace(/-/g, ' ');

    // Extract all filter params from URL
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number(pageParam) : 0;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const sellerIds = searchParams.get("sellerIds") ? searchParams.get("sellerIds")?.split(",").map(Number) : undefined;

    const { data, isLoading, isError, error } = useGetProductsQuery({
        page,
        perPage: 12, // Standardized to matches 4-col grid
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
    const pagination = data ? {
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
    } : { pageNumber: 0, totalPages: 0, totalElements: 0 };

    const handleClearFilters = () => {
        router.push(window.location.pathname);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-[#F5F3F4] min-h-screen">
            <div className="container max-w-[1600px] mx-auto py-24 px-6 md:px-8">
                {/* Archivist Header */}
                <div className="mb-20 space-y-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                        <Link href="/" className="hover:text-primary transition-colors">TRANG CHỦ</Link>
                        <span>/</span>
                        <span className="text-foreground">{displayTitle.toUpperCase()}</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-labels font-bold text-6xl uppercase tracking-tighter text-foreground">
                            {displayTitle}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">Danh mục sản phẩm</span>
                            <div className="h-px bg-foreground/10 flex-1" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">{pagination.totalElements} SẢN PHẨM</span>
                        </div>
                    </div>
                </div>

                {/* Top Section: Seller Grid (Integrated with Dossier aesthetics) */}
                <div className="mb-20">
                    <SellerGrid categorySlug={categorySlug} />
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Desktop Sidebar: Filter Panel */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-32">
                        <div className="p-6 border border-foreground/5 bg-white/50 backdrop-blur-sm rounded-sm">
                            <FilterPanel categorySlug={categorySlug} />
                        </div>
                    </aside>

                    {/* Right Content: Product List */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-12 pb-6 border-b border-foreground/5">
                            <div className="lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-sm border-foreground/10 font-bold uppercase tracking-widest h-10 px-6 font-labels">
                                            <SlidersHorizontal className="mr-3 h-3.5 w-3.5" />
                                            Bộ lọc sản phẩm
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[350px] font-labels">
                                        <SheetHeader className="pb-8 border-b border-border/10 mb-8">
                                            <SheetTitle className="text-left font-bold uppercase tracking-widest text-lg font-labels">Bộ lọc sản phẩm</SheetTitle>
                                        </SheetHeader>
                                        <FilterPanel categorySlug={categorySlug} />
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <div className="flex-1 lg:flex-none">
                                <SortPanel totalResults={pagination.totalElements} />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-4 animate-pulse">
                                        <div className="aspect-[4/5] bg-secondary/50 rounded-sm" />
                                        <div className="h-2 bg-secondary/50 w-1/4" />
                                        <div className="h-4 bg-secondary/50 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="text-center py-32 border border-dashed border-red-200 rounded-sm bg-red-50/30">
                                <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] font-labels">{error ? String(error) : 'Lỗi truy xuất danh mục'}</p>
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
                                            firstVariant={product.firstVariant}
                                        />
                                    ))}
                                </div>

                                {/* Pagination: Formal Archival Style */}
                                {pagination.totalPages > 1 && (
                                    <div className="mt-32 flex items-center justify-between border-t border-foreground/5 pt-16">
                                        <button 
                                            disabled={pagination.pageNumber === 0}
                                            onClick={() => handlePageChange(pagination.pageNumber - 1)}
                                            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:text-primary transition-all font-labels"
                                        >
                                            <MoveLeft className="h-4 w-4" />
                                            Trang trước
                                        </button>
                                        
                                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                                            TRANG {pagination.pageNumber + 1} / {pagination.totalPages}
                                        </div>

                                        <button 
                                            disabled={pagination.pageNumber + 1 >= pagination.totalPages}
                                            onClick={() => handlePageChange(pagination.pageNumber + 1)}
                                            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:text-primary transition-all font-labels"
                                        >
                                            Trang tiếp
                                            <MoveRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-32 border border-dashed border-foreground/10 rounded-sm bg-white/10">
                                <ShoppingBag className="w-12 h-12 text-foreground/5 mx-auto mb-8" strokeWidth={1} />
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60 mb-4 font-labels">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-10 max-w-xs mx-auto leading-relaxed font-labels">
                                    Vui lòng điều chỉnh bộ lọc sản phẩm để mở rộng phạm vi tìm kiếm.
                                </p>
                                <Button onClick={handleClearFilters} variant="outline" className="rounded-sm border-foreground/10 text-foreground text-[10px] font-bold uppercase tracking-widest px-12 h-12 hover:bg-foreground hover:text-white transition-all font-labels">
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
