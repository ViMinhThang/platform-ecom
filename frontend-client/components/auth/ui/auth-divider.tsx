"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthDividerProps {
    text?: string;
    className?: string;
}

export function AuthDivider({ text, className }: AuthDividerProps) {
    return (
        <div className={cn("relative flex items-center py-4", className)}>
            <div className="flex-grow border-t border-border" />
            {text && (
                <span className="mx-4 flex-shrink-0 text-xs font-medium text-muted-foreground">
                    {text}
                </span>
            )}
            <div className="flex-grow border-t border-border" />
        </div>
    );
}
