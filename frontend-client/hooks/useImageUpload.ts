import { useState } from 'react';
import { uploadProfileImage } from '@/lib/api/profile';
import { LIMITS, FILE_TYPES, VALIDATION_MESSAGES } from '@/lib/constants';
import { toast } from 'sonner';

/**
 * Custom hook for handling profile image uploads.
 * Includes file validation and error handling.
 * 
 * @param userId - User ID for the upload
 * @param onSuccess - Callback to execute after successful upload
 * @returns Object containing upload handler and loading state
 * 
 * @example
 * const { handleImageUpload, isUploading } = useImageUpload(user.userId, onUpdate);
 */
export function useImageUpload(userId: number, onSuccess?: () => void) {
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!FILE_TYPES.IMAGES.includes(file.type)) {
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
            await uploadProfileImage(userId, file);
            toast.success('Profile image updated');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return {
        handleImageUpload,
        isUploading,
    };
}
