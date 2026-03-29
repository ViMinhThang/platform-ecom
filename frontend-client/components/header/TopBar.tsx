"use client";

import Link from "next/link";
import { Facebook, Instagram, Bell, HelpCircle, Globe } from "lucide-react";

export const TopBar = () => {
    return (
        <div className="w-full bg-transparent border-b border-border/10 text-foreground/30 text-[9px] font-bold uppercase tracking-[0.3em] hidden md:block">
            <div className="container mx-auto px-4 h-9 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/seller" className="hover:text-primary transition-colors">
                        Kênh người bán
                    </Link>
                    <Link href="/download" className="hover:text-primary transition-colors">
                        Tải ứng dụng
                    </Link>
                    <div className="flex items-center gap-4 border-l border-border/10 pl-6">
                        <Link href="#" className="hover:text-primary transition-colors">
                            <Facebook className="h-3 w-3" />
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            <Instagram className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <Link href="/notifications" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Bell className="h-3 w-3" />
                        <span>Thông báo</span>
                    </Link>
                    <Link href="/help" className="flex items-center gap-2 hover:text-primary transition-colors">
                        <HelpCircle className="h-3 w-3" />
                        <span>Hỗ trợ</span>
                    </Link>
                    <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer border-l border-border/10 pl-8">
                        <Globe className="h-3 w-3" />
                        <span>Tiếng Việt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
