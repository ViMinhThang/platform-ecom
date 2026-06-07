"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShoppingBag, Shield, Zap } from "lucide-react";

interface AuthBrandPanelProps {
    title?: string;
    description?: string;
    variant?: "dark" | "light";
    className?: string;
}

export function AuthBrandPanel({
    title = "Nền tảng mua sắm hiện đại",
    description = "Khám phá hàng ngàn sản phẩm chất lượng với trải nghiệm mua sắm tối ưu và giao hàng nhanh chóng.",
    variant = "dark",
    className,
}: AuthBrandPanelProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col justify-between p-8 lg:p-12 h-full",
                variant === "dark" && "bg-gradient-to-br from-primary to-primary/80 text-white",
                variant === "light" && "bg-muted/30",
                className
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 opacity-5",
                    "bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)]",
                    "bg-[24px_24px]"
                )}
            />

            <Link href="/" className="relative z-10 flex items-center gap-3 group">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <ShoppingBag className="size-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">ACME</span>
            </Link>

            <div className="relative z-10 space-y-6">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                    {title}
                </h1>
                <p className="text-base text-white/80 leading-relaxed max-w-md">
                    {description}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <Shield className="size-4" />
                        <span>Bảo mật cao</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <Zap className="size-4" />
                        <span>Giao hàng nhanh</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 text-sm text-white/50">
                    <div className="h-px flex-1 bg-white/10" />
                    <span>© 2026 ACME</span>
                </div>
            </div>
        </div>
    );
}
