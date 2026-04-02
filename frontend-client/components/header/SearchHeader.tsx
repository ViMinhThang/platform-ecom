"use client";

import { Search, ShoppingCart, Clock, X } from "lucide-react";
import Link from "next/link";
import { useGetCartQuery } from "@/lib/store/api/clientApi";
import { UserNav } from "@/components/UserNav";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const MAX_HISTORY = 5;

export const SearchHeader = () => {
    const { data: cart } = useGetCartQuery();
    const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const historyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("acme_search_history");
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
                setShowHistory(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const saveSearch = (term: string) => {
        const normalized = term.trim();
        if (!normalized) return;
        const newHistory = [normalized, ...history.filter(h => h !== normalized)].slice(0, MAX_HISTORY);
        setHistory(newHistory);
        localStorage.setItem("acme_search_history", JSON.stringify(newHistory));
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            saveSearch(searchTerm);
            setShowHistory(false);
            router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleHistoryClick = (term: string) => {
        setSearchTerm(term);
        saveSearch(term);
        setShowHistory(false);
        router.push(`/products?q=${encodeURIComponent(term)}`);
    };

    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory([]);
        localStorage.removeItem("acme_search_history");
    };

    const removeHistoryItem = (e: React.MouseEvent, term: string) => {
        e.stopPropagation();
        const newHistory = history.filter(h => h !== term);
        setHistory(newHistory);
        localStorage.setItem("acme_search_history", JSON.stringify(newHistory));
    };

    return (
        <header className="w-full surface-glass sticky top-0 z-50 font-labels transition-all duration-300">
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between gap-12">
                {/* LOGO */}
                <Link href="/" className="shrink-0 flex items-center gap-1.5">
                    <span className="font-labels text-lg font-extrabold tracking-tighter text-foreground">
                        Editorial
                    </span>
                    <span className="font-labels text-lg font-extrabold tracking-tighter text-primary">
                        Market
                    </span>
                </Link>

                {/* CENTER NAVIGATION */}
                <nav className="hidden lg:flex items-center gap-10">
                    {[
                        { label: "Cửa hàng", href: "/shop" },
                        { label: "Khuyến mãi", href: "/deals" },
                        { label: "Hàng mới về", href: "/new-arrivals" },
                        { label: "Bán chạy", href: "/best-sellers" }
                    ].map((item) => (
                        <Link 
                            key={item.label} 
                            href={item.href}
                            className="text-[13px] font-bold text-foreground/70 hover:text-primary transition-colors tracking-tight"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* SEARCH & ACTIONS */}
                <div className="flex items-center gap-6 flex-1 max-w-xl justify-end ml-auto">
                    {/* Search Input (Rounded/Minimal) */}
                    <div className="relative flex-1 group" ref={historyRef}>
                        <div className="flex items-center bg-surface-container/50 hover:bg-surface-container rounded-full px-5 py-2 transition-all">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm độc đáo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                                onFocus={() => setShowHistory(true)}
                                className="bg-transparent border-none outline-none text-[13px] font-medium w-full placeholder:text-foreground/30 focus:ring-0"
                            />
                            <Search className="h-4 w-4 text-foreground/30 shrink-0" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <Link href="/cart" className="relative p-2 hover:opacity-70 transition-all group">
                            <ShoppingCart className="h-[22px] w-[22px] text-foreground" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-bold h-[16px] min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        <UserNav />
                    </div>
                </div>
            </div>
        </header>
    );
};
