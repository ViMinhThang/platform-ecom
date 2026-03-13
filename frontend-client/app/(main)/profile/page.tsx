"use client"
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfileInfoForm } from '@/components/profile/ProfileInfoForm';
import { AddressManager } from '@/components/profile/AddressManager';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAddresses } from '@/lib/store/slices/addressSlice';
import { fetchUserProfile } from '@/lib/store/slices/authSlice';
import { ProfileLayout } from '@/components/profile/ProfileLayout';

import { Suspense } from 'react';

function ProfilePageContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'profile';

    const { user, loading: authLoading } = useAppSelector((state) => state.auth);
    const { addresses } = useAppSelector((state) => state.address);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.accessToken) {
            const token = session.accessToken as string;
            dispatch(fetchAddresses(token));
            dispatch(fetchUserProfile({ token }));
        }
    }, [session, dispatch]);

    const handleProfileUpdate = () => {
        if (session?.accessToken) {
            const token = session.accessToken as string;
            dispatch(fetchUserProfile({ token }));
        }
    };

    const handleAddressUpdate = () => {
        if (session?.accessToken) {
            dispatch(fetchAddresses(session.accessToken as string));
        }
    };

    if (status === 'loading' || authLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const renderContent = () => {
        switch (currentTab) {
            case 'addresses':
                return (
                    <div>
                        <div className="mb-12 border-b border-border pb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold uppercase tracking-tighter text-foreground">Sổ <span className="text-primary italic">địa chỉ</span></h2>
                                <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-[0.2em] opacity-60">
                                    QUẢN LÝ ĐỊA CHỈ GIAO HÀNG (TỐI ĐA 5)
                                </p>
                            </div>
                            <div className="hidden sm:block text-[9px] font-bold bg-primary/5 text-primary px-3 py-1 rounded-sm border border-primary/10 tracking-widest shadow-sm">ADDR_MGR_v2.0</div>
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
                    <div>
                        <div className="mb-12 border-b border-border pb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold uppercase tracking-tighter text-foreground">Hồ sơ <span className="text-primary italic">cá nhân</span></h2>
                                <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-[0.2em] opacity-60">
                                    CẬP NHẬT THÔNG TIN ĐỊNH DANH
                                </p>
                            </div>
                            <div className="hidden sm:block text-[9px] font-bold bg-primary/5 text-primary px-3 py-1 rounded-sm border border-primary/10 tracking-widest shadow-sm">ID_PROFILE_v3.0</div>
                        </div>
                        <ProfileInfoForm user={user} onUpdate={handleProfileUpdate} />
                    </div>
                );
        }
    };

    return (
        <ProfileLayout>
            <div className="mb-8 lg:hidden">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-foreground">
                    {currentTab === 'profile' && 'THÔNG TIN CÁ NHÂN'}
                    {currentTab === 'addresses' && 'SỔ ĐỊA CHỈ'}
                </h1>
            </div>
            {renderContent()}
        </ProfileLayout>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfilePageContent />
        </Suspense>
    );
}
