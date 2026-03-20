"use client";

import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SellerGrid } from "@/components/category/SellerGrid";
import { FilterPanel } from "@/components/category/FilterPanel";
import { SortPanel } from "@/components/category/SortPanel";
import { Pagination } from "@/components/ui/Pagination";
import { useGetProductsQuery } from "@/lib/store/api/clientApi";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";
import React from "react";

interface CategoryPageClientProps {
    slug: string;
}

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
    const router = useRouter();
    
    const categorySlug = decodeURIComponent(slug);
    const displayTitle = categorySlug.replace(/-/g, ' ');

    // Extract all filter params from URL
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number(pageParam) : 0;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;

    const { data, isLoading, isError, error } = useGetProductsQuery({
        page,
        perPage: 15,
        category: categorySlug,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        minRating,
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

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <Breadcrumbs 
                items={[
                    { label: "Categories", href: "/categories" },
                    { label: displayTitle }
                ]} 
                className="mb-6"
            />

            {/* Top Section: Seller Grid */}
            <SellerGrid categorySlug={categorySlug} />

            <div className="mt-8 mb-6">
                <h1 className="text-4xl font-black tracking-tighter capitalize italic">
                    {displayTitle}
                </h1>
                <p className="text-muted-foreground mt-2 font-medium italic">
                    Explore the best products in {displayTitle}
                </p>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar: Filter Panel */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-24">
                        <FilterPanel />
                    </div>
                </aside>

                {/* Right Content: Product List */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-none border-2 border-black font-bold uppercase tracking-wider h-9">
                                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                                        Bộ lọc
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px]">
                                    <SheetHeader>
                                        <SheetTitle className="text-left font-black uppercase italic tracking-tighter text-2xl">Bộ lọc</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-8">
                                        <FilterPanel />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className="flex-1 lg:flex-none">
                            <SortPanel totalResults={pagination.totalElements} />
                        </div>
                    </div>

                    {isLoading ? (
                        <ProductGridSkeleton count={10} />
                    ) : isError ? (
                        <div className="text-center py-24 bg-red-50 border-2 border-black">
                            <p className="text-red-600 font-black uppercase italic tracking-widest">{error ? String(error) : 'An error occurred'}</p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id.toString()}
                                        slug={product.slug || `product-${product.id}`}
                                        name={product.name}
                                        price={product.minPrice || 0}
                                        image={product.imageUrl || ""}
                                        category={product.category.name}
                                        isNew={false}
                                        rating={product.averageRating}
                                        soldCount={product.totalSold}
                                        firstVariant={product.firstVariant}
                                    />
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={pagination.pageNumber}
                                    totalPages={pagination.totalPages}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-24 bg-zinc-50 border-2 border-dashed border-zinc-200">
                            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">
                                Không tìm thấy sản phẩm
                            </h3>
                            <p className="text-muted-foreground mb-6 font-medium italic">
                                Thử thay đổi bộ lọc hoặc xóa tất cả để xem thêm sản phẩm.
                            </p>
                            <Button onClick={handleClearFilters} variant="default" className="rounded-none bg-black text-white hover:bg-zinc-800 uppercase font-bold tracking-widest">
                                Xóa tất cả bộ lọc
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
