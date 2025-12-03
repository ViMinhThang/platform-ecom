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

export default function ProfilePage() {
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Book</CardTitle>
                            <CardDescription>
                                Manage your shipping addresses. You can add up to 5 addresses.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressManager
                                addresses={addresses}
                                onUpdate={handleAddressUpdate}
                            />
                        </CardContent>
                    </Card>
                );
            case 'orders':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                            <CardDescription>
                                View your past orders and their status.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrderHistory />
                        </CardContent>
                    </Card>
                );
            case 'profile':
            default:
                return (
                    <Card >
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details and profile picture.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileInfoForm user={user} onUpdate={handleProfileUpdate} />
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <ProfileLayout>
            <div className="mb-6 lg:hidden">
                <h1 className="text-2xl font-bold tracking-tight">
                    {currentTab === 'profile' && 'Profile'}
                    {currentTab === 'addresses' && 'Addresses'}
                    {currentTab === 'orders' && 'Orders'}
                </h1>
            </div>
            {renderContent()}
        </ProfileLayout>
    );
}
