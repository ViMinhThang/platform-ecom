"use client";

import Link from "next/link";
import { Facebook, Instagram, Bell, HelpCircle, Globe } from "lucide-react";

export const TopBar = () => {
    return (
        <div className="w-full bg-background/50 backdrop-blur-md border-b text-muted-foreground text-[10px] font-medium uppercase tracking-widest hidden md:block">
            <div className="container mx-auto px-4 h-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller" className="hover:text-primary transition-colors">
                        Kênh người bán
                    </Link>
                    <div className="h-3 w-px bg-border" />
                    <Link href="/download" className="hover:text-primary transition-colors">
                        Tải ứng dụng
                    </Link>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-3">
                        <span className="opacity-70">Kết nối</span>
                        <Link href="#" className="hover:text-primary transition-colors">
                            <Facebook className="h-3 w-3" />
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            <Instagram className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/notifications" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Bell className="h-3 w-3" />
                        <span>Thông báo</span>
                    </Link>
                    <Link href="/help" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <HelpCircle className="h-3 w-3" />
                        <span>Hỗ trợ</span>
                    </Link>
                    <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                        <Globe className="h-3 w-3" />
                        <span>Tiếng Việt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
