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
    currentPassword: z.string().optional(),
    password: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password.length > 0 && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required to change password",
    path: ["currentPassword"],
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
            currentPassword: '',
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
            // Only send password fields if they are provided
            const updateData: any = {
                username: data.username,
                email: data.email,
            };

            if (data.password && data.currentPassword) {
                updateData.password = data.password;
                updateData.currentPassword = data.currentPassword;
            }

            await updateUserInfo(updateData, token);
            toast.success('Profile updated successfully');
            // Reset password fields
            form.setValue('currentPassword', '');
            form.setValue('password', '');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-2 border-border">
                            <AvatarImage src={user.imageUrl} alt={user.username} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-muted">
                                {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm">
                            <label htmlFor="image-upload" className="cursor-pointer p-2 text-white hover:scale-110 transition-transform">
                                {isUploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <Upload className="h-8 w-8" />
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
                    <div className="text-center">
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            JPG, GIF or PNG. Max 5MB.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 w-full max-w-md">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4">
                            <FormField
                                label="Username"
                                id="username"
                                registration={form.register('username')}
                                error={form.formState.errors.username}
                                disabled={isSaving}
                                placeholder="Enter your username"
                            />

                            <FormField
                                label="Email"
                                id="email"
                                type="email"
                                registration={form.register('email')}
                                error={form.formState.errors.email}
                                disabled={isSaving}
                                placeholder="Enter your email"
                            />

                            <div className="pt-2 border-t mt-2">
                                <h4 className="text-sm font-medium mb-3">Change Password</h4>
                                <div className="space-y-4">
                                    <FormField
                                        label="Current Password"
                                        id="currentPassword"
                                        type="password"
                                        registration={form.register('currentPassword')}
                                        error={form.formState.errors.currentPassword}
                                        disabled={isSaving}
                                        placeholder="Enter current password"
                                    />

                                    <FormField
                                        label="New Password"
                                        id="password"
                                        type="password"
                                        registration={form.register('password')}
                                        error={form.formState.errors.password}
                                        disabled={isSaving}
                                        placeholder="Enter new password"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Leave blank if you don't want to change your password.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
