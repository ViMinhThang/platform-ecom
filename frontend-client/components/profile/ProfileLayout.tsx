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
        title: 'Profile',
        href: '/profile',
        icon: User,
    },
    {
        title: 'Addresses',
        href: '/profile?tab=addresses',
        icon: MapPin,
    },
    {
        title: 'Orders',
        href: '/profile?tab=orders',
        icon: ShoppingBag,
    },
];

export function ProfileLayout({ children }: ProfileLayoutProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'profile';


    return (
        <div className="container max-w-5xl py-10 mx-auto ">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/4">
                    <nav className="flex space-x-2 overflow-x-auto px-4 lg:flex-col lg:space-x-0 lg:space-y-1 lg:overflow-visible bg-white rounded-lg p-4 mr-4">
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
                                        "flex items-center justify-start gap-2 rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                        <Button
                            variant="ghost"
                            className="justify-start gap-2 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
