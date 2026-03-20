import { useCallback } from 'react';
import {
  useGetProductImagesQuery,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
} from '@/lib/store/api';

/**
 * Hook for managing product images using RTK Query
 * Provides images, loading states, and CRUD operations
 */
export function useProductImages(productId: number) {
  const { data: images = [], isLoading, refetch } = useGetProductImagesQuery(productId);
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();
  const [deleteProductImage, { isLoading: isDeleting }] = useDeleteProductImageMutation();

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        await uploadProductImage({ productId, file }).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to upload image', error);
        return false;
      }
    },
    [productId, uploadProductImage]
  );

  const deleteImage = useCallback(
    async (imageId: number) => {
      try {
        await deleteProductImage({ productId, imageId }).unwrap();
        return true;
      } catch (error) {
        console.error('Failed to delete image', error);
        return false;
      }
    },
    [productId, deleteProductImage]
  );

  return {
    images,
    loading: isLoading,
    uploading: isUploading,
    deleting: isDeleting,
    uploadImage,
    deleteImage,
    refreshImages: refetch,
  };
}
