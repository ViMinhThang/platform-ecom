"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/category/FilterPanel";
import { SortPanel } from "@/components/category/SortPanel";
import { Pagination } from "@/components/ui/Pagination";
import { SellerHero } from "@/components/product/SellerHero";
import { getProductsBySeller } from "@/lib/services/product-service";
import { getSellerInfo, SellerInfo } from "@/lib/services/user-service";
import { ProductRow } from "@/types/product";
import { ShoppingBag, SlidersHorizontal, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SellerStorePageClientProps {
    sellerId: string;
}

export function SellerStorePageClient({ sellerId }: SellerStorePageClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<ProductRow[]>([]);
    const [seller, setSeller] = useState<SellerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageNumber: 0,
        pageSize: 12,
        totalElements: 0,
        totalPages: 0,
        lastPage: true
    });

    // Ref to prevent double initial fetch if possible
    const isFirstRun = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Extract all filter params from URL
    const page = Number(searchParams.get("page")) || 0;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;

    const fetchData = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        try {
            // Fetch seller info only once
            if (!seller) {
                const sellerData = await getSellerInfo(Number(sellerId));
                setSeller(sellerData);
            }

            // Fetch seller products
            const productData = await getProductsBySeller({
                sellerId: Number(sellerId),
                page,
                perPage: 12,
                sortBy,
                sortOrder,
                category,
                minPrice,
                maxPrice,
                minRating
            });

            if (controller.signal.aborted) return;

            setProducts(productData.content);
            setPagination({
                pageNumber: productData.pageNumber,
                pageSize: productData.pageSize,
                totalElements: productData.totalElements,
                totalPages: productData.totalPages,
                lastPage: productData.lastPage
            });
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Failed to fetch seller store data:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu cửa hàng.");
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, [sellerId, page, sortBy, sortOrder, category, minPrice, maxPrice, minRating, seller]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleClearFilters = () => {
        router.push(pathname);
    };

    if (error) {
        return (
            <div className="container mx-auto py-24 text-center">
                <p className="text-destructive font-bold">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <div className="container mx-auto py-6 px-4 md:px-6">
                <Breadcrumbs 
                    items={[
                        { label: "Sellers", href: "/sellers" },
                        { label: seller?.username || "Store" }
                    ]} 
                    className="mb-6"
                />

                {seller && (
                    <SellerHero
                        seller={seller}
                        totalProducts={pagination.totalElements}
                        totalSold={1500}
                        createdAt="2023-01-15T00:00:00Z"
                    />
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar: Filter Panel */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24 bg-white p-6 border-2 border-black">
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* Right Content: Product List */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-none border-2 border-black font-bold uppercase tracking-wider h-9 bg-white">
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

                        {loading ? (
                            <ProductGridSkeleton count={8} className="lg:grid-cols-4" />
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                            <div className="text-center py-24 bg-white border-2 border-dashed border-zinc-200">
                                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="text-muted-foreground mb-6 font-medium italic">
                                    Cửa hàng hiện chưa có sản phẩm nào phù hợp với bộ lọc.
                                </p>
                                <Button onClick={handleClearFilters} variant="default" className="rounded-none bg-black text-white hover:bg-zinc-800 uppercase font-bold tracking-widest">
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
