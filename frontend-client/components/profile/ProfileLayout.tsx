'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface ProfileLayoutProps {
    children: React.ReactNode;
}

const sidebarItems = [
    {
        title: 'THÔNG TIN CÁ NHÂN',
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
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'profile';


    return (
        <div className="container max-w-6xl py-12 mx-auto">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 gap-12">
                <aside className="lg:w-1/4">
                    <nav className="flex space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-2 bg-background border border-border p-2 shadow-md rounded-sm">
                        <div className="p-4 bg-primary/5 border-b border-border mb-2 hidden lg:block rounded-t-sm">
                            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-70">
                                Bảng điều khiển // Tài khoản
                            </div>
                        </div>
                        {sidebarItems.map((item) => {
                            // Determine if this item is active
                            // For "Profile" (default), check if tab is missing or 'profile'
                            // For others, check if tab matches
                            const itemTab = item.href.split('tab=')[1] || 'profile';
                            const isActive = currentTab === itemTab;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-start gap-4 p-4 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm border-l-2",
                                        isActive
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/30 border-transparent"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-primary")} />
                                    {item.title}
                                </Link>
                            );
                        })}
                        <Button
                            variant="ghost"
                            className="justify-start gap-4 w-full rounded-sm p-4 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 text-[11px] font-bold uppercase tracking-widest transition-all mt-4 border border-transparent hover:border-red-100"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="h-4 w-4" />
                            ĐĂNG XUẤT
                        </Button>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-4xl">
                    <div className="bg-background border border-border p-10 min-h-[600px] shadow-lg rounded-sm">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
