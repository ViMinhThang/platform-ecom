'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/user';
import { getUserProfile, getUserAddresses } from '@/lib/api/profile';
import { ProfileInfoForm } from '@/components/profile/ProfileInfoForm';
import { AddressManager } from '@/components/profile/AddressManager';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/sign-in');
        }
    }, [status, router]);

    const fetchProfileData = async () => {
        if (!session?.user) return;

        try {
            // @ts-ignore
            const userId = session.user.id as string;
            const data = await getUserProfile(userId);

            // Also fetch addresses separately to ensure we have the latest list
            // Although getUserProfile might include them, getUserAddresses is the dedicated endpoint
            const addresses = await getUserAddresses();
            setProfile({ ...data, addresses });
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchProfileData();
        }
    }, [session]);

    if (status === 'loading' || loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return null; // Or error state
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
                            <ProfileInfoForm user={profile} onUpdate={fetchProfileData} />
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
                                addresses={profile.addresses || []}
                                onUpdate={fetchProfileData}
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
