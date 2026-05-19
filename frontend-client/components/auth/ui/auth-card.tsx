"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function AuthCard({ className, children, ...props }: AuthCardProps) {
    return (
        <div
            className={cn(
                "bg-card rounded-sm border border-border/50 p-6 shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
