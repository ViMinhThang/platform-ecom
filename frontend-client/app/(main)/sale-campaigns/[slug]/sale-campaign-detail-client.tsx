'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Zap, ArrowLeft, SlidersHorizontal, Filter, Loader2 } from 'lucide-react';
import { SaleCampaign, SaleCampaignItem } from '@/types/sale-campaign';
import { PaginatedResponse } from '@/types/common.types';
import {
    CountdownTimer,
    SaleCampaignProductCard,
    SaleCampaignFilter,
    SaleCampaignSort,
    SortOption
} from '@/components/sale-campaign';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { getSaleCampaignItems } from '@/lib/services/sale-campaign-service';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

interface SaleCampaignDetailClientProps {
    saleCampaign: SaleCampaign;
    initialData: PaginatedResponse<SaleCampaignItem>;
    isMainPage?: boolean;
}

export function SaleCampaignDetailClient({ saleCampaign, initialData, isMainPage = false }: SaleCampaignDetailClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Parse URL params
    const initialMinPrice = Number(searchParams.get('minPrice')) || 0;
    const initialMaxPrice = Number(searchParams.get('maxPrice')) || 20000000;
    const initialInStock = searchParams.get('inStock') === 'true';
    const initialSort = (searchParams.get('sort') as SortOption) || 'sold-count-desc';

    const [items, setItems] = useState<SaleCampaignItem[]>(initialData.content);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(!initialData.last);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
    const [showInStockOnly, setShowInStockOnly] = useState(initialInStock);
    const [sortOption, setSortOption] = useState<SortOption>(initialSort);

    const debouncedPriceRange = useDebounce(priceRange, 500);

    const isFirstRun = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!searchParams.has('maxPrice') && initialData.content.length > 0) {
            const max = Math.max(...initialData.content.map(i => i.salePrice));
            if (max > priceRange[1]) {
                setPriceRange([0, max * 1.5]);
            }
        }
    }, []);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const params = new URLSearchParams(searchParams.toString());

        if (debouncedPriceRange[0] > 0) params.set('minPrice', debouncedPriceRange[0].toString());
        else params.delete('minPrice');

        if (debouncedPriceRange[1] < 20000000) params.set('maxPrice', debouncedPriceRange[1].toString()); // Assuming 20m is default max
        else params.delete('maxPrice');

        if (showInStockOnly) params.set('inStock', 'true');
        else params.delete('inStock');

        if (sortOption !== 'sold-count-desc') params.set('sort', sortOption);
        else params.delete('sort');

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });

        fetchItems(false);

    }, [debouncedPriceRange, showInStockOnly, sortOption]);

    const fetchItems = useCallback(async (isLoadMore = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const currentPage = isLoadMore ? page + 1 : 0;
        const loadingStateSetter = isLoadMore ? setIsLoadingMore : setIsLoading;

        loadingStateSetter(true);
        try {
            const [sortBy, sortOrder] = parseSortOption(sortOption);

            const data = await getSaleCampaignItems(saleCampaign.slug, {
                page: currentPage,
                size: 24,
                minPrice: debouncedPriceRange[0],
                maxPrice: debouncedPriceRange[1] > 0 ? debouncedPriceRange[1] : undefined,
                inStockOnly: showInStockOnly,
                sortBy,
                sortOrder: sortOrder as 'asc' | 'desc'
            });

            if (controller.signal.aborted) return;

            if (isLoadMore) {
                setItems(prev => [...prev, ...data.content]);
                setPage(currentPage);
            } else {
                setItems(data.content);
                setPage(0);
            }

            setHasMore(!data.last);
        } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Failed to fetch items:', error);
                toast.error('Không thể tải sản phẩm');
            }
        } finally {
            if (!controller.signal.aborted) {
                loadingStateSetter(false);
            }
        }
    }, [saleCampaign.slug, page, debouncedPriceRange, showInStockOnly, sortOption]);

    const handleLoadMore = () => {
        fetchItems(true);
    };

    const handleClearFilters = () => {
        setPriceRange([0, 20000000]);
        setShowInStockOnly(false);
        setSortOption('sold-count-desc');
    };

    const parseSortOption = (option: SortOption): [string, string] => {
        switch (option) {
            case 'price-asc': return ['salePrice', 'asc'];
            case 'price-desc': return ['salePrice', 'desc'];
            case 'discount-desc': return ['discountPercent', 'desc'];
            case 'sold-count-desc': return ['soldCount', 'desc'];
            default: return ['soldCount', 'desc'];
        }
    };

    return (
        <div>
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black border-b-4 border-primary">
                {saleCampaign.bannerUrl && (
                    <div className="absolute inset-0 opacity-30">
                        <Image
                            src={"http://localhost:8080/uploads/products/" + saleCampaign.bannerUrl}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="relative container mx-auto px-4 py-12">
                    {!isMainPage && (
                        <Button asChild variant="outline" size="sm" className="mb-6 rounded-none border-white text-white hover:bg-white hover:text-black">
                            <Link href="/sale-campaigns">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Tất cả Sale Campaigns
                            </Link>
                        </Button>
                    )}

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary animate-pulse">
                                <Zap className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
                                    {saleCampaign.name}
                                </h1>
                                {saleCampaign.description && (
                                    <p className="text-white/70 mt-2 max-w-xl">{saleCampaign.description}</p>
                                )}
                                <div className="text-white/50 text-sm mt-2">
                                    {saleCampaign.totalItems} sản phẩm đang giảm giá
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-white/50 text-xs uppercase tracking-widest font-bold mb-2">
                                Kết thúc trong
                            </div>
                            <CountdownTimer endTime={saleCampaign.endTime} variant="banner" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar Filters */}
                    <div className="hidden lg:block w-64 shrink-0 space-y-8">
                        <SaleCampaignFilter
                            minPrice={0}
                            maxPrice={20000000}
                            currentPriceRange={priceRange}
                            onPriceChange={setPriceRange}
                            showInStockOnly={showInStockOnly}
                            onShowInStockOnlyChange={setShowInStockOnly}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    {/* Mobile Filters & Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
                            <div className="text-sm text-zinc-500 font-medium">
                                Hiển thị <span className="text-black font-bold">{items.length}</span> sản phẩm
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Mobile Filter Button */}
                                <div className="lg:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-9 rounded-none gap-2">
                                                <SlidersHorizontal className="h-4 w-4" />
                                                Bộ lọc
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                            <SheetHeader className="mb-6">
                                                <SheetTitle className="uppercase font-black tracking-wider text-left">Bộ lọc sản phẩm</SheetTitle>
                                            </SheetHeader>
                                            <SaleCampaignFilter
                                                minPrice={0}
                                                maxPrice={20000000}
                                                currentPriceRange={priceRange}
                                                onPriceChange={setPriceRange}
                                                showInStockOnly={showInStockOnly}
                                                onShowInStockOnlyChange={setShowInStockOnly}
                                                onClearFilters={handleClearFilters}
                                            />
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                {/* Sort Dropdown */}
                                <SaleCampaignSort
                                    value={sortOption}
                                    onValueChange={setSortOption}
                                />
                            </div>
                        </div>

                        {/* Loading State (Initial Filter) */}
                        {isLoading && items.length === 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[2/3] bg-zinc-100 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Products Grid */}
                                {items.length === 0 ? (
                                    <div className="text-center py-16 bg-zinc-50 border-2 border-dashed border-zinc-200">
                                        <Filter className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Không tìm thấy sản phẩm</h3>
                                        <p className="text-zinc-500 mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm lại</p>
                                        <Button onClick={handleClearFilters} variant="default" className="bg-black text-white hover:bg-zinc-800 rounded-none">
                                            Xóa bộ lọc
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {items.map((item) => (
                                            <SaleCampaignProductCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                )}

                                {/* Load More */}
                                {hasMore && (
                                    <div className="mt-12 text-center">
                                        <Button
                                            onClick={handleLoadMore}
                                            variant="outline"
                                            size="lg"
                                            disabled={isLoadingMore}
                                            className="min-w-[200px] rounded-none border-black hover:bg-black hover:text-white transition-colors uppercase font-bold tracking-widest"
                                        >
                                            {isLoadingMore ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                'Xem thêm'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
