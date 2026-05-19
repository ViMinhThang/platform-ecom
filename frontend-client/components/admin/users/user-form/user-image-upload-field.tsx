"use client";

import { useState } from "react";
import { useUploadAvatarMutation } from "@/lib/store/admin";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface UserImageUploadFieldProps {
    imageUrl: string | undefined;
    setImage: (url: string) => void;
    userId: number | null | undefined;
    loading: boolean;
}

export const UserImageUploadField: React.FC<UserImageUploadFieldProps> = ({
    imageUrl,
    setImage,
    userId,
    loading,
}) => {
    const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!userId) {
            toast.error("Vui lòng lưu người dùng trước khi tải lên hình ảnh");
            return;
        }

        try {
            const result = await uploadAvatar({ id: userId, file }).unwrap();
            setImage(result.imageUrl || "");
            toast.success("Tải lên hình ảnh thành công");
        } catch (error) {
            console.error("Image upload failed", error);
            toast.error("Không thể tải lên hình ảnh");
        }
    };

    const displayImageUrl = imageUrl
        ? (imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080/uploads/${imageUrl}`)
        : null;

    return (
        <div className="flex flex-col items-center space-y-3">
            <input
                type="file"
                id="user-image-upload"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isUploading || loading || !userId}
                className="hidden"
            />

            <label
                htmlFor="user-image-upload"
                className={`
                    relative w-32 h-32 rounded-full border-2 border-dashed 
                    flex items-center justify-center cursor-pointer
                    transition-all duration-200
                    ${!userId ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-muted/50'}
                    ${isUploading ? 'cursor-wait' : ''}
                `}
            >
                {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                ) : displayImageUrl ? (
                    <img
                        src={displayImageUrl}
                        alt="Hồ sơ người dùng"
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs">Upload</span>
                    </div>
                )}

                {displayImageUrl && !isUploading && userId && (
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                    </div>
                )}
            </label>

            <div className="text-center">
                <p className="text-sm font-medium">Hình đại diện</p>
                {!userId && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Lưu người dùng trước để tải lên
                    </p>
                )}
                {userId && !isUploading && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Nhấn để {displayImageUrl ? 'thay đổi' : 'tải lên'}
                    </p>
                )}
            </div>
        </div>
    );
};
