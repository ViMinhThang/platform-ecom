"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export function ProductFeed() {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector((state) => state.products);
    const [activeTab, setActiveTab] = useState("daily");

    useEffect(() => {
        dispatch(fetchProducts({
            sortBy: activeTab === 'top' ? 'price' : 'created_at',
            sortOrder: activeTab === 'top' ? 'asc' : 'desc',
            perPage: 24
        }));
    }, [activeTab, dispatch]);

    return (
        <div className="container mx-auto px-4 mb-20">
            {/* Industrial Tab Header */}
            <div className="sticky top-[100px] z-40 bg-white border-2 border-black mb-8">
                <div className="flex border-b border-black">
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'daily'
                            ? 'bg-black text-white'
                            : 'bg-white text-zinc-400 hover:text-black'
                            }`}
                    >
                        Gợi ý dành cho bạn
                    </button>
                    <button
                        onClick={() => setActiveTab('top')}
                        className={`flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-l border-black ${activeTab === 'top'
                            ? 'bg-black text-white'
                            : 'bg-white text-zinc-400 hover:text-black'
                            }`}
                    >
                        Xu hướng tìm kiếm
                    </button>
                </div>
                <div className="px-6 py-2 bg-zinc-50 flex justify-between items-center border-t border-black/5">
                    <span className="text-[9px] font-bold opacity-40">HỆ THỐNG ĐÃ CẬP NHẬT</span>
                    <span className="text-[9px] font-bold opacity-40">PHIÊN BẢN v1.2</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-h-[400px]">
                {loading && products.length === 0 ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse border border-black/5" />
                    ))
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="h-full border border-black/10 hover:border-black transition-all bg-white">
                            <ProductCard
                                id={product.id.toString()}
                                slug={product.slug}
                                name={product.name}
                                price={product.minPrice}
                                image={product.imageUrl || ''}
                                category={product.category.name}
                                soldCount={124}
                            />
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-center mt-12">
                <Button className="px-12 py-6 rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all">
                    Xem thêm sản phẩm
                </Button>
            </div>
        </div>
    );
}
