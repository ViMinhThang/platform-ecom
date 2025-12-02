'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProfileInfoForm } from '@/components/profile/ProfileInfoForm';
import { AddressManager } from '@/components/profile/AddressManager';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, MapPin, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { checkAuth } from '@/lib/store/slices/authSlice';
import { fetchAddresses } from '@/lib/store/slices/addressSlice';
import { fetchUserOrders } from '@/lib/store/slices/orderSlice';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

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
            dispatch(checkAuth(token));
            dispatch(fetchAddresses(token));
            dispatch(fetchUserOrders({ token }));
        }
    }, [session, dispatch]);

    const handleProfileUpdate = () => {
        if (session?.accessToken) {
            dispatch(checkAuth(session.accessToken as string));
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

    return (
        <div className="container max-w-6xl py-10 mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your profile settings, addresses, and view your order history.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="addresses">
                        <MapPin className="mr-2 h-4 w-4" />
                        Addresses
                    </TabsTrigger>
                    <TabsTrigger value="orders">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Orders
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
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
                </TabsContent>

                <TabsContent value="addresses">
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
                </TabsContent>

                <TabsContent value="orders">
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
