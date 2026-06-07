import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { uploadProfileImage } from '@/lib/services/user-service';
import { LIMITS, FILE_TYPES, VALIDATION_MESSAGES } from '@/lib/constants';
import { toast } from 'sonner';

/**
 * Custom hook for handling profile image uploads.
 * Includes file validation and error handling.
 * Authentication is handled automatically by apiClient interceptors.
 * 
 * @param userId - User ID for the upload (passed to hook for context, not used in API call)
 * @param onSuccess - Callback to execute after successful upload
 * @returns Object containing upload handler and loading state
 */
export function useImageUpload(userId: number, onSuccess?: () => void) {
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!FILE_TYPES.IMAGES.includes(file.type as any)) {
            toast.error(VALIDATION_MESSAGES.IMAGE_TYPE_INVALID);
            return;
        }

        // Validate file size (5MB max)
        if (file.size > LIMITS.MAX_IMAGE_SIZE) {
            toast.error(VALIDATION_MESSAGES.IMAGE_SIZE_TOO_LARGE);
            return;
        }

        setIsUploading(true);
        try {
            await uploadProfileImage(file);
            toast.success('Đã cập nhật ảnh hồ sơ');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Không thể tải ảnh lên');
        } finally {
            setIsUploading(false);
        }
    };

    return {
        handleImageUpload,
        isUploading,
    };
}
