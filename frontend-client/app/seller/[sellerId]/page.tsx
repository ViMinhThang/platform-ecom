"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/category/FilterPanel";
import { SortPanel } from "@/components/category/SortPanel";
import { Pagination } from "@/components/ui/Pagination";
import { SellerHero } from "@/components/product/SellerHero";
import { getProductsBySeller } from "@/lib/services/product-service";
import { getSellerInfo, SellerInfo } from "@/lib/services/user-service";
import { ProductRow } from "@/types/product";
import { ShoppingBag } from "lucide-react";

interface SellerStorePageProps {
    params: Promise<{ sellerId: string }>;
}

export default function SellerStorePage({ params }: SellerStorePageProps) {
    const { sellerId } = use(params);
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

    // Extract all filter params from URL
    const page = Number(searchParams.get("page")) || 0;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch seller info
                const sellerData = await getSellerInfo(Number(sellerId));
                setSeller(sellerData);

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

                setProducts(productData.content);
                setPagination({
                    pageNumber: productData.pageNumber,
                    pageSize: productData.pageSize,
                    totalElements: productData.totalElements,
                    totalPages: productData.totalPages,
                    lastPage: productData.lastPage
                });
            } catch (err) {
                console.error("Failed to fetch seller store data:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu cửa hàng.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sellerId, page, sortBy, sortOrder, category, minPrice, maxPrice, minRating]);

    if (error) {
        return (
            <div className="container mx-auto py-24 text-center">
                <p className="text-destructive font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen">
            <div className="container mx-auto py-8 px-4 md:px-6">
                {seller && (
                    <SellerHero
                        seller={seller}
                        totalProducts={pagination.totalElements}
                        totalSold={1500} // Placeholder until backend provides real stats
                        createdAt="2023-01-15T00:00:00Z" // Placeholder
                    />
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar: Filter Panel */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="sticky top-24">
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* Right Content: Product List */}
                    <main className="flex-1">
                        <SortPanel totalResults={pagination.totalElements} />

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-white animate-pulse rounded-md" />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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

                                <div className="mt-12">
                                    <Pagination
                                        currentPage={pagination.pageNumber}
                                        totalPages={pagination.totalPages}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-24 bg-white border border-dashed rounded-lg mt-6">
                                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                <p className="text-zinc-500 font-medium">
                                    Cửa hàng hiện chưa có sản phẩm nào phù hợp.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
