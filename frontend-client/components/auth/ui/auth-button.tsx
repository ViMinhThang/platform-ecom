"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AuthButtonProps extends React.ComponentProps<typeof Button> {
    loading?: boolean;
    children: React.ReactNode;
}

export function AuthButton({ className, loading, children, disabled, ...props }: AuthButtonProps) {
    return (
        <Button
            type="submit"
            disabled={disabled || loading}
            className={cn(
                "h-12 w-full rounded-sm font-semibold text-sm transition-all duration-200",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-sm hover:shadow-md",
                className
            )}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Đang xử lý..." : children}
        </Button>
    );
}
