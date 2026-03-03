"use client";

import { Search, ShoppingCart, Clock, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/UserNav";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export const SearchHeader = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const router = useRouter();
    const { cart } = useAppSelector((state) => state.cart);
    const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target as Node)
            ) {
                setShowHistory(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        };
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            addSearch(searchQuery.trim());
            setShowHistory(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
        if (e.key === "Escape") {
            setShowHistory(false);
        }
    };

    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        addSearch(query);
        setShowHistory(false);
        router.push(`/products?search=${encodeURIComponent(query)}`);
    };

    const handleRemoveEntry = (e: React.MouseEvent, query: string) => {
        e.stopPropagation();
        removeSearch(query);
    };

    const handleClearAll = () => {
        clearHistory();
        setShowHistory(false);
    };

    const handleFocus = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        if (history.length > 0) {
            setShowHistory(true);
        }
    };

    const handleBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            setShowHistory(false);
        }, 200);
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
                <div className="flex-1 max-w-4xl relative" ref={searchContainerRef}>
                    <div className="relative flex bg-white ring-2 ring-white/10 focus-within:ring-primary transition-all">
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm hoặc mã hàng..."
                            className="flex-1 px-4 py-3 text-black placeholder:text-zinc-400 text-sm font-bold outline-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (history.length > 0) setShowHistory(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-8 bg-primary hover:bg-primary/90 text-white transition-colors flex items-center justify-center font-black uppercase tracking-widest text-xs"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            <span className="hidden sm:inline">Tìm kiếm</span>
                        </button>
                    </div>

                    {/* Search History Dropdown */}
                    {showHistory && history.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 shadow-xl z-[60] overflow-hidden rounded-sm animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="py-1">
                                {history.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => handleHistoryClick(item)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors group"
                                    >
                                        <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
                                        <span className="flex-1 text-left truncate font-medium">{item}</span>
                                        <span
                                            role="button"
                                            onClick={(e) => handleRemoveEntry(e, item)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-200 rounded transition-all shrink-0"
                                            title="Xóa"
                                        >
                                            <X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-zinc-200 px-4 py-2">
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-primary hover:text-primary/80 font-bold transition-colors"
                                >
                                    Xóa lịch sử tìm kiếm
                                </button>
                            </div>
                        </div>
                    )}

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
