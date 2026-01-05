"use client";

import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/UserNav";

export const SearchHeader = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { cart } = useAppSelector((state) => state.cart);
    const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full bg-black text-white py-6 sticky top-0 z-50 border-b-2 border-primary/20">
            <div className="container mx-auto px-4 flex items-center gap-8 md:gap-16">
                {/* Logo */}
                <Link href="/" className="shrink-0 flex items-center gap-3 group">
                    <div className="bg-primary text-white p-2 shrink-0">
                        <ShoppingCartsIcon className="h-8 w-8" />
                    </div>
                    <div className="hidden lg:flex flex-col -space-y-1">
                        <span className="font-black text-3xl tracking-tighter uppercase leading-none group-hover:tracking-normal transition-all duration-300">ACME</span>
                        <span className="text-[10px] font-bold tracking-[0.1em] opacity-40">MUA SẮM TRỰC TUYẾN</span>
                    </div>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-4xl relative">
                    <div className="relative flex bg-white ring-2 ring-white/10 focus-within:ring-primary transition-all">
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm hoặc mã hàng..."
                            className="flex-1 px-4 py-3 text-black placeholder:text-zinc-400 text-sm font-bold outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-8 bg-primary hover:bg-primary/90 text-white transition-colors flex items-center justify-center font-black uppercase tracking-widest text-xs"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            <span className="hidden sm:inline">Tìm kiếm</span>
                        </button>
                    </div>
                    {/* Quick Search Tags */}
                    <div className="hidden md:flex items-center gap-4 mt-2 text-[10px] text-white/40 font-bold uppercase tracking-widest overflow-hidden whitespace-nowrap">
                        <span className="text-primary font-black">Xu hướng:</span>
                        {['Điện tử', 'Phụ kiện', 'Thời trang', 'Đồ gia dụng', 'Dụng cụ'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => router.push(`/products?search=${encodeURIComponent(tag)}`)}
                                className="hover:text-white transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cart & Actions */}
                <div className="flex items-center gap-8 shrink-0">
                    <Link href="/cart" className="relative group">
                        <div className="p-2 border border-white/10 group-hover:border-primary transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        {cartItemCount > 0 && (
                            <Badge className="absolute -right-2 -top-2 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] font-black bg-primary text-white border-none">
                                {cartItemCount}
                            </Badge>
                        )}
                    </Link>

                    <div className="flex items-center">
                        <UserNav />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShoppingCartsIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
)
