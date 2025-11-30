"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/form-input";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateUserImage } from "@/lib/store/slices/userSlice";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface UserImageUploadFieldProps {
    imageUrl: string | undefined;
    setImage: (url: string) => void;
    userId: number | null | undefined;
    loading: boolean;
}

/**
 * User Image Upload Field
 * Handles user profile image upload
 */
export const UserImageUploadField: React.FC<UserImageUploadFieldProps> = ({
    imageUrl,
    setImage,
    userId,
    loading,
}) => {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const [uploading, setUploading] = useState(false);

    /**
     * Handles image file selection and upload
     */
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!userId) {
            toast.error("Please save the user first before uploading an image");
            return;
        }

        if (!session?.accessToken) {
            toast.error("Authentication required");
            return;
        }

        setUploading(true);

        try {
            const result = await dispatch(
                updateUserImage({
                    id: userId,
                    file,
                    token: session.accessToken,
                })
            );

            if (updateUserImage.fulfilled.match(result)) {
                setImage(result.payload.imageUrl);
                toast.success("Image uploaded successfully");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            logger.error("Image upload failed", error as Error, { userId });
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input
                type="text"
                placeholder="Enter image URL or upload below"
                value={imageUrl || ""}
                onChange={(e) => setImage(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-md"
            />

            <div className="flex items-center gap-3">
                <input
                    type="file"
                    id="user-image-upload"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={uploading || loading}
                    className="hidden"
                />
                <label htmlFor="user-image-upload">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={uploading || loading || !userId}
                        asChild
                    >
                        <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                    </Button>
                </label>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="User preview"
                        className="h-12 w-12 rounded-full object-cover"
                    />
                )}
            </div>

            {!userId && (
                <p className="text-sm text-muted-foreground">
                    Save the user first to enable image upload
                </p>
            )}
        </div>
    );
};
