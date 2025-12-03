"use client";

import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@/lib/store/provider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <SessionProvider>
                <ReduxProvider>
                    {children}
                </ReduxProvider>
            </SessionProvider>
        </ErrorBoundary>
    );
}
