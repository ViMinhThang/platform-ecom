"use client";

import { useState, useEffect, useCallback } from "react";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY = 5;

export function useSearchHistory() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setHistory(parsed.slice(0, MAX_HISTORY));
                }
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    const saveToStorage = useCallback((items: string[]) => {
        try {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items));
        } catch {
            // Ignore storage errors (e.g. quota exceeded)
        }
    }, []);

    const addSearch = useCallback(
        (query: string) => {
            const trimmed = query.trim();
            if (!trimmed) return;

            setHistory((prev) => {
                const filtered = prev.filter(
                    (item) => item.toLowerCase() !== trimmed.toLowerCase()
                );
                const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
                saveToStorage(updated);
                return updated;
            });
        },
        [saveToStorage]
    );

    const removeSearch = useCallback(
        (query: string) => {
            setHistory((prev) => {
                const updated = prev.filter((item) => item !== query);
                saveToStorage(updated);
                return updated;
            });
        },
        [saveToStorage]
    );

    const clearHistory = useCallback(() => {
        setHistory([]);
        saveToStorage([]);
    }, [saveToStorage]);

    return { history, addSearch, removeSearch, clearHistory };
}
