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
                    <nav className="flex space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-1 bg-white border-2 border-black p-0">
                        <div className="p-4 bg-zinc-100 border-b-2 border-black mb-1 hidden lg:block">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                CONTROL_PANEL // USER
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
                                        "flex items-center justify-start gap-3 p-4 text-sm font-bold uppercase tracking-wider transition-all rounded-none border-l-4",
                                        isActive
                                            ? "bg-black text-white border-black"
                                            : "text-zinc-500 hover:bg-zinc-100 border-transparent hover:border-zinc-300"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                        <Button
                            variant="ghost"
                            className="justify-start gap-3 w-full rounded-none p-4 h-auto text-red-600 hover:text-white hover:bg-red-600 font-bold uppercase tracking-wider transition-all"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="h-4 w-4" />
                            ĐĂNG XUẤT
                        </Button>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-4xl">
                    <div className="bg-white border-2 border-black p-8 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
