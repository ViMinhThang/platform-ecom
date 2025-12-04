import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchProductImages,
  uploadProductImage,
  deleteProductImage,
  ProductImage,
} from '@/lib/store/slices/productImageSlice';
import { toast } from 'sonner';

/**
 * Hook for managing product images using Redux
 * Provides images, loading states, and CRUD operations
 */
export function useProductImages(productId: number) {
  const dispatch = useAppDispatch();
  const { imagesByProductId, loading, error, uploadProgress } = useAppSelector(
    (state) => state.productImages
  );

  const images = imagesByProductId[productId] || [];

  // Fetch images on mount or when productId changes
  useEffect(() => {
    dispatch(fetchProductImages(productId));
  }, [dispatch, productId]);

  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Upload image
  const uploadImage = useCallback(
    async (file: File) => {
      try {
        await dispatch(uploadProductImage({ productId, file })).unwrap();
        toast.success('Image uploaded successfully!');
      } catch (err) {
        toast.error('Failed to upload image');
        console.error('Failed to upload image', err);
      }
    },
    [dispatch, productId]
  );

  // Delete image
  const deleteImage = useCallback(
    async (imageId: number) => {
      try {
        await dispatch(deleteProductImage({ productId, imageId })).unwrap();
        toast.success('Image deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete image');
        console.error('Failed to delete image', err);
      }
    },
    [dispatch, productId]
  );

  // Refresh images
  const refreshImages = useCallback(() => {
    dispatch(fetchProductImages(productId));
  }, [dispatch, productId]);

  return {
    images,
    loading,
    uploading: loading && uploadProgress > 0,
    uploadProgress,
    uploadImage,
    deleteImage,
    refreshImages,
  };
}

