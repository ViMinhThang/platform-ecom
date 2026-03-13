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
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    email: z.string().email('Địa chỉ email không hợp lệ'),
    currentPassword: z.string().optional(),
    password: z.string().optional(),
}).refine((data) => {
    if (data.password && data.password.length > 0 && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Mật khẩu hiện tại là bắt buộc để đổi mật khẩu",
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
            toast.error('Bạn phải đăng nhập để cập nhật hồ sơ');
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

            await updateUserInfo(updateData);
            toast.success('Cập nhật hồ sơ thành công');
            // Reset password fields
            form.setValue('currentPassword', '');
            form.setValue('password', '');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Cập nhật hồ sơ thất bại');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-12 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-6">
                    <div className="relative group p-1 bg-background border border-border shadow-md rounded-sm">
                        <Avatar className="h-32 w-32 rounded-sm">
                            <AvatarImage src={user.imageUrl} alt={user.username} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-primary/5 rounded-sm font-bold text-primary opacity-30">
                                {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-1 flex items-center justify-center bg-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-sm backdrop-blur-sm">
                            <label htmlFor="image-upload" className="cursor-pointer p-3 bg-background/20 rounded-sm text-white hover:scale-110 transition-transform border border-white/20">
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
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Ảnh đại diện</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-2 opacity-50">
                            JPG, PNG. Tối đa 5MB.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 w-full max-w-lg">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6">
                             <FormField
                                label="TÊN ĐỊNH DANH"
                                id="username"
                                registration={form.register('username')}
                                error={form.formState.errors.username}
                                disabled={isSaving}
                                placeholder="Nhập tên đăng nhập"
                                className="text-[10px] font-bold uppercase tracking-widest"
                            />
 
                            <FormField
                                label="EMAIL LIÊN HỆ"
                                id="email"
                                type="email"
                                registration={form.register('email')}
                                error={form.formState.errors.email}
                                disabled={isSaving}
                                placeholder="Nhập địa chỉ email"
                                className="text-[10px] font-bold uppercase tracking-widest"
                            />

                            <div className="pt-8 border-t border-dashed border-border mt-8">
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground mb-8">Bảo mật & Mật khẩu</h4>
                                <div className="space-y-6">
                                     <FormField
                                        label="MẬT KHẨU HIỆN TẠI"
                                        id="currentPassword"
                                        type="password"
                                        registration={form.register('currentPassword')}
                                        error={form.formState.errors.currentPassword}
                                        disabled={isSaving}
                                        placeholder="Xác thực mật khẩu cũ"
                                        className="text-[10px] font-bold uppercase tracking-widest"
                                    />

                                    <FormField
                                        label="MẬT KHẨU MỚI"
                                        id="password"
                                        type="password"
                                        registration={form.register('password')}
                                        error={form.formState.errors.password}
                                        disabled={isSaving}
                                        placeholder="Thiết lập mật khẩu mới"
                                        className="text-[10px] font-bold uppercase tracking-widest"
                                    />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 italic">
                                        * ĐỂ TRỐNG NẾU KHÔNG THAY ĐỔI
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start pt-6">
                            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto rounded-sm h-12 px-10 shadow-lg shadow-primary/10 text-[11px] font-bold uppercase tracking-widest transition-all">
                                {isSaving && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
