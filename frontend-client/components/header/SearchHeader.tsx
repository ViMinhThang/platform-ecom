"use client";

import { Search, ShoppingCart, User, Clock, X } from "lucide-react";
import Link from "next/link";
import { useGetCartQuery } from "@/lib/store/api/clientApi";
import { UserNav } from "@/components/UserNav";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const MAX_HISTORY = 5;

export const SearchHeader = () => {
    const { data: cart } = useGetCartQuery();
    const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const pathname = usePathname();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const historyRef = useRef<HTMLDivElement>(null);

    // PERSISTENCE: Load History
    useEffect(() => {
        const saved = localStorage.getItem("acme_search_history");
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // CLICK OUTSIDE: Close History
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
        <header className="w-full bg-white/80 border-b border-[#E7E5E4]/20 backdrop-blur-xl shadow-sm sticky top-0 z-50 font-labels transition-all duration-300">
            <div className="w-full px-12 h-[72px] flex items-center justify-between gap-16">
                {/* LOGO: Far Left */}
                <Link href="/" className="shrink-0">
                    <span className="font-labels text-3xl font-bold tracking-tighter text-foreground hover:opacity-80 transition-opacity">
                        ACME
                    </span>
                </Link>

                {/* SEARCH: Center & Wider & Less Rounded */}
                <div className="relative flex-1 max-w-3xl mx-auto" ref={historyRef}>
                    <div className="flex items-center bg-[#F5F3F4] border border-foreground/5 rounded-sm px-5 py-2.5 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-inner">
                        <Search className="h-4 w-4 text-foreground/40 mr-3" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            onFocus={() => setShowHistory(true)}
                            className="bg-transparent border-none outline-none text-[13px] font-medium w-full placeholder:text-foreground/30 focus:ring-0 uppercase tracking-widest font-labels"
                        />
                    </div>

                    {/* Search History Dropdown */}
                    {showHistory && history.length > 0 && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white/95 backdrop-blur-md border border-border/10 shadow-2xl rounded-sm p-8 animate-in fade-in slide-in-from-top-2 duration-300 z-50 overflow-hidden">
                            <div className="flex items-center justify-between mb-8 pb-3 border-b border-border/5">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">Lịch sử tìm kiếm</span>
                                <button 
                                    onClick={clearHistory}
                                    className="text-[9px] font-bold uppercase text-primary hover:opacity-70 transition-opacity font-labels tracking-widest"
                                >
                                    Xóa hết
                                </button>
                            </div>
                            <div className="space-y-3">
                                {history.map((term) => (
                                    <div 
                                        key={term}
                                        onClick={() => handleHistoryClick(term)}
                                        className="flex items-center justify-between group/item p-4 hover:bg-[#F5F3F4] transition-colors cursor-pointer rounded-sm border border-transparent hover:border-foreground/5"
                                    >
                                        <div className="flex items-center gap-5">
                                            <Clock className="h-4 w-4 text-foreground/10" />
                                            <span className="text-[13px] font-bold uppercase tracking-widest text-foreground/70 group-hover/item:text-foreground transition-colors truncate max-w-[500px] font-labels">
                                                {term}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={(e) => removeHistoryItem(e, term)}
                                            className="opacity-0 group-hover/item:opacity-100 hover:text-red-500 transition-all px-3"
                                        >
                                            <X className="h-4 w-4 text-foreground/20" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ACTIONS: Far Right */}
                <div className="flex items-center gap-2 hrink-0 translate-y-[2px]">
                    <Link href="/cart" className="relative p-2 hover:bg-secondary/20 rounded-full transition-all group">
                        <ShoppingCart className="h-6 w-6 text-foreground/40 group-hover:text-primary transition-colors" />
                        {cartItemCount > 0 && (
                            <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold h-4 min-w-[18px] px-1 rounded-full flex items-center justify-center translate-x-1/2 translate-y-[-1/2] shadow-sm ring-2 ring-white">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>

                    <UserNav />
                </div>
            </div>
        </header>
    );
};
