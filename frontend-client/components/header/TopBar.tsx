"use client";

import Link from "next/link";
import { Facebook, Instagram, Bell, HelpCircle, Globe } from "lucide-react";

export const TopBar = () => {
    return (
        <div className="w-full bg-surface-container-high text-foreground/50 text-xs font-medium hidden md:block">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-9 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/seller" className="hover:text-primary transition-colors">
                        Kênh người bán
                    </Link>
                    <Link href="/download" className="hover:text-primary transition-colors">
                        Tải ứng dụng
                    </Link>
                    <div className="flex items-center gap-4 pl-6">
                        <Link href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                            <Facebook className="size-3.5" />
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                            <Instagram className="size-3.5" />
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="/notifications" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Bell className="size-3.5" />
                        <span>Thông báo</span>
                    </Link>
                    <Link href="/help" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <HelpCircle className="size-3.5" />
                        <span>Hỗ trợ</span>
                    </Link>
                    <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer pl-8">
                        <Globe className="size-3.5" />
                        <span>Tiếng Việt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
