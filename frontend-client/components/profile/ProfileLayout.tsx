'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, MapPin, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface ProfileLayoutProps {
    children: React.ReactNode;
}

const sidebarItems = [
    {
        title: 'THÔNG TIN TÀI KHOẢN',
        href: '/profile',
        icon: User,
    },
    {
        title: 'SỔ ĐỊA CHỈ',
        href: '/profile?tab=addresses',
        icon: MapPin,
    },
];

export function ProfileLayout({ children }: ProfileLayoutProps) {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'profile';

    return (
        <div className="bg-background min-h-screen font-labels antialiased">
            {/* STICKY HEADER BRIDGE */}
            <div className="border-b border-foreground/5 bg-white/80 backdrop-blur-md sticky top-[72px] z-30 transition-all">
                <div className="container max-w-[1600px] mx-auto px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 font-labels">
                        <Link href="/" className="hover:text-primary transition-colors">TRANG CHỦ</Link>
                        <span>/</span>
                        <span className="text-foreground">TÀI KHOẢN CỦA BẠN</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-[1600px] py-20 mx-auto px-12">
                <div className="flex flex-col space-y-12 lg:flex-row lg:space-y-0 gap-16 items-start">
                    {/* SIDEBAR: WHITE CARD LIST */}
                    <aside className="lg:w-80 shrink-0 sticky top-40">
                        <nav className="bg-white border border-foreground/10 p-2 rounded-[4px] shadow-sm overflow-hidden">
                            <div className="p-6 bg-secondary/5 border-b border-foreground/5 mb-2 hidden lg:block">
                                <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.4em] font-labels">
                                    DANH MỤC QUẢN LÝ
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                {sidebarItems.map((item) => {
                                    const itemTab = item.href.split('tab=')[1] || 'profile';
                                    const isActive = currentTab === itemTab;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-start gap-5 p-5 text-[11px] font-bold uppercase tracking-widest transition-all rounded-[2px] border-l-4",
                                                isActive
                                                    ? "bg-primary/5 text-primary border-primary"
                                                    : "text-foreground/40 hover:bg-muted/30 border-transparent hover:text-foreground/60"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-foreground/20")} />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-8 border-t border-foreground/5 p-4">
                                <Button
                                    variant="ghost"
                                    className="justify-start gap-4 w-full rounded-sm p-5 h-auto text-red-500 hover:text-red-600 hover:bg-red-50/50 text-[11px] font-bold uppercase tracking-widest transition-all border border-transparent hover:border-red-100/20 font-labels"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    <LogOut className="h-4 w-4" />
                                    ĐĂNG XUẤT
                                </Button>
                            </div>
                        </nav>
                    </aside>

                    {/* MAIN CONTENT AREA: WHITE CARD CANVAS */}
                    <div className="flex-1 lg:max-w-5xl">
                        <div className="bg-white border border-foreground/10 p-12 lg:p-20 min-h-[700px] shadow-sm rounded-[4px]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
