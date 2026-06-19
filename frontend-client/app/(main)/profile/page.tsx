"use client"
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileInfoForm } from '@/components/profile/ProfileInfoForm';
import { AddressManager } from '@/components/profile/AddressManager';
import { LayoutDashboard } from 'lucide-react';
import { useGetUserProfileQuery, useGetAddressesQuery } from '@/lib/store/api/clientApi';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Suspense } from 'react';

function ProfilePageContent() {
    const { data: session, status } = useSession();
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const get = searchParams.get.bind(searchParams);
    const currentTab = get('tab') || 'profile';

    const { data: user, isLoading: authLoading, refetch: refetchUser } = useGetUserProfileQuery();
    const { data: addresses = [], refetch: refetchAddresses } = useGetAddressesQuery();

    useEffect(() => {
        if (status === 'unauthenticated') {
            push('/auth/sign-in');
        }
    }, [status, push]);

    const handleProfileUpdate = () => {
        refetchUser();
    };

    const handleAddressUpdate = () => {
        refetchAddresses();
    };

    if (status === 'loading' || authLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center gap-y-8">
                <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-labels italic text-foreground/40 animate-pulse ml-4">Đang truy xuất hồ sơ…</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Check if user has SELLER role for admin dashboard access
    const hasSellerRole = session?.user?.roles?.includes('ROLE_SELLER') || false;

    const renderContent = () => {
        switch (currentTab) {
            case 'addresses':
                return (
                    <div className="space-y-16">
                        <div className="pb-12 border-b border-foreground/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-semibold uppercase tracking-tighter text-foreground font-labels">
                                    Sổ địa chỉ
                                </h2>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] font-labels">
                                    QUẢN LÝ ĐỊA CHỈ GIAO HÀNG TẬN NƠI
                                </p>
                            </div>
                            <div className="hidden sm:block text-[9px] font-bold bg-primary/5 text-primary px-4 py-1.5 rounded-[2px] border border-primary/10 tracking-[0.3em] font-labels">SỔ_ĐỊA_CHỈ_v2</div>
                        </div>
                        <AddressManager
                            addresses={addresses}
                            onUpdate={handleAddressUpdate}
                        />
                    </div>
                );
            case 'profile':
            default:
                return (
                    <div className="space-y-16">
                        <div className="pb-12 border-b border-foreground/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-semibold uppercase tracking-tighter text-foreground font-labels">
                                    Thông tin tài khoản
                                </h2>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] font-labels">
                                    CẬP NHẬT THÔNG TIN ĐỊNH DANH HỘI VIÊN
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                {hasSellerRole && (
                                    <Link href="/admin/dashboard">
                                        <Button variant="outline" size="sm" className="gap-3 h-11 px-6 text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 rounded-[2px] font-labels">
                                            <LayoutDashboard className="size-4" />
                                            QUẢN LÝ CỬA HÀNG
                                        </Button>
                                    </Link>
                                )}
                                <div className="hidden sm:block text-[9px] font-bold bg-primary/5 text-primary px-4 py-1.5 rounded-[2px] border border-primary/10 tracking-[0.3em] font-labels">HỒ_SƠ_v3</div>
                            </div>
                        </div>
                        <ProfileInfoForm user={user} onUpdate={handleProfileUpdate} />
                    </div>
                );
        }
    };

    const content = renderContent();

    return (
        <ProfileLayout>
            <div className="mb-12 lg:hidden">
                <h1 className="text-3xl font-semibold uppercase tracking-tighter text-foreground font-labels">
                    {currentTab === 'profile' && 'THÔNG TIN TÀI KHOẢN'}
                    {currentTab === 'addresses' && 'SỔ ĐỊA CHỈ'}
                </h1>
            </div>
            {content}
        </ProfileLayout>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F5F3F4] animate-pulse" />}>
            <ProfilePageContent />
        </Suspense>
    );
}
