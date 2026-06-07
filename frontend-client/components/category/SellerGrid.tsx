'use client';

import { useEffect, useState } from "react";
import { SellerCard } from "./SellerCard";
import { getTopSellers, TopSeller } from "@/lib/services/product-service";

interface SellerGridProps {
    categorySlug: string;
}

export function SellerGrid({ categorySlug }: SellerGridProps) {
    const [sellers, setSellers] = useState<TopSeller[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                setLoading(true);
                const data = await getTopSellers(categorySlug, 10);
                setSellers(data);
            } catch (error) {
                console.error('Failed to fetch top sellers:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categorySlug) {
            fetchSellers();
        }
    }, [categorySlug]);

    if (loading) {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Người bán hàng đầu</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={"skeleton-" + i} className="space-y-2 animate-pulse">
                            <div className="aspect-square w-full bg-muted rounded" />
                            <div className="h-4 w-3/4 mx-auto bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (sellers.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Người bán hàng đầu</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sellers.map((seller) => (
                    <SellerCard
                        key={seller.sellerId}
                        id={seller.sellerId.toString()}
                        name={seller.sellerName}
                        image={seller.imageUrl || "https://placehold.co/400x400/png?text=Nguoi%20ban"}
                    />
                ))}
            </div>
        </div>
    );
}
