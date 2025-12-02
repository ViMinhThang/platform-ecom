'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserProfile } from '@/types/user';
import { updateUserInfo } from '@/lib/services/user-service';
import { useImageUpload } from '@/hooks/useImageUpload';
import { FormField } from '@/components/common/form/FormField';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

const profileSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInfoFormProps {
    user: UserProfile;
    onUpdate: () => void;
}

/**
 * Form component for managing user profile information.
 * Updated to use NextAuth session for token management.
 */
export function ProfileInfoForm({ user, onUpdate }: ProfileInfoFormProps) {
    const { data: session } = useSession();
    const [isSaving, setIsSaving] = useState(false);

    // Use custom hook for image upload
    const { handleImageUpload, isUploading } = useImageUpload(user.userId, onUpdate);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
            password: '',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to update your profile');
            return;
        }

        setIsSaving(true);
        try {
            await updateUserInfo(data, token);
            toast.success('Profile updated successfully');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative group">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                        <AvatarImage src={user.imageUrl} alt={user.username} />
                        <AvatarFallback className="text-2xl sm:text-4xl">
                            {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <label htmlFor="image-upload" className="cursor-pointer p-2 text-white">
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <Upload className="h-6 w-6" />
                            )}
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                        Click on the image to upload a new one. JPG, GIF or PNG. Max size 5MB.
                    </p>
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormField
                    label="Username"
                    id="username"
                    registration={form.register('username')}
                    error={form.formState.errors.username}
                    disabled={isSaving}
                />

                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    registration={form.register('email')}
                    error={form.formState.errors.email}
                    disabled={isSaving}
                />

                <FormField
                    label="Password"
                    id="password"
                    type="password"
                    registration={form.register('password')}
                    error={form.formState.errors.password}
                    disabled={isSaving}
                />

                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
