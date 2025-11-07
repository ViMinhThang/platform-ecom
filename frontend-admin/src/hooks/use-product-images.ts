import { useState, useEffect, useCallback } from "react";
import {
  getProductImages,
  uploadProductImage,
  deleteProductImage,
  setMainProductImage,
  ProductImage,
} from "@/services/product-image-service";

export function useProductImages(productId: number, token?: string) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch images
  const fetchImages = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getProductImages(productId, token);
      setImages(res);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  }, [productId, token]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!token) return;
      setUploading(true);
      try {
        const newImage = await uploadProductImage(productId, file, token);
        setImages((prev) => [...prev, newImage]);
      } catch (error) {
        console.error("Failed to upload image", error);
      } finally {
        setUploading(false);
      }
    },
    [productId, token]
  );

  const deleteImage = useCallback(
    async (imageId: number) => {
      if (!token) return;
      try {
        const deletedId = await deleteProductImage(productId, imageId, token);
        setImages((prev) => prev.filter((img) => img.id !== deletedId));
      } catch (error) {
        console.error("Failed to delete image", error);
      }
    },
    [productId, token]
  );


  return {
    images,
    loading,
    uploading,
    fetchImages,
    uploadImage,
    deleteImage,
  };
}
