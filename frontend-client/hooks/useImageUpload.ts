import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { uploadProfileImage } from '@/lib/services/user-service';
import { LIMITS, FILE_TYPES, VALIDATION_MESSAGES } from '@/lib/constants';
import { toast } from 'sonner';

/**
 * Custom hook for handling profile image uploads with NextAuth token.
 * Includes file validation and error handling.
 * 
 * @param userId - User ID for the upload
 * @param onSuccess - Callback to execute after successful upload
 * @returns Object containing upload handler and loading state
 */
export function useImageUpload(userId: number, onSuccess?: () => void) {
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = session?.accessToken as string;
        if (!token) {
            toast.error('You must be logged in to upload images');
            return;
        }

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
            await uploadProfileImage(userId, file, token);
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
