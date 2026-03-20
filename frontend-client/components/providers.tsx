"use client";

import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@/lib/store/provider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { StoreInitializer } from "@/components/providers/StoreInitializer";
import { NuqsAdapter } from "nuqs/adapters/next";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <SessionProvider>
                <ReduxProvider>
                    <NuqsAdapter>
                        <StoreInitializer />
                        {children}
                    </NuqsAdapter>
                </ReduxProvider>
            </SessionProvider>
        </ErrorBoundary>
    );
}
