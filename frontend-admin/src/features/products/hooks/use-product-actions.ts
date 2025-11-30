import { useSession } from "next-auth/react";
import { Product } from "@/types/product/product";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { createProduct, updateProduct } from "@/lib/store/slices/productSlice";
import { logger } from "@/lib/logger";
import { AuthenticationError } from "@/lib/errors";

/**
 * Hook for product CRUD actions
 * Provides abstracted methods for creating and updating products
 */
export function useProductActions() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.products);

  /**
   * Validates that user is authenticated
   * @throws {AuthenticationError} if no access token is available
   */
  function ensureAuthenticated(): string {
    if (!session?.accessToken) {
      logger.warn("Attempted product action without authentication");
      throw new AuthenticationError("Please log in to continue");
    }
    return session.accessToken;
  }

  /**
   * Creates a new product
   * @param productData - Product data without ID
   * @returns Created product
   * @throws {Error} if creation fails
   */
  const handleCreateProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    const token = ensureAuthenticated();

    logger.debug("Creating product", { productName: productData.name });

    const resultAction = await dispatch(
      createProduct({
        data: productData,
        token,
      })
    );

    if (createProduct.fulfilled.match(resultAction)) {
      logger.info("Product created successfully", {
        productId: resultAction.payload.id,
      });
      return resultAction.payload;
    }

    if (createProduct.rejected.match(resultAction)) {
      const errorMessage = resultAction.payload as string;
      logger.error("Product creation failed", undefined, { errorMessage });
      throw new Error(errorMessage);
    }
  };

  /**
   * Updates an existing product
   * @param productId - ID of product to update
   * @param productData - Partial product data to update
   * @returns Updated product
   * @throws {Error} if update fails
   */
  const handleUpdateProduct = async (
    productId: number,
    productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ) => {
    const token = ensureAuthenticated();

    logger.debug("Updating product", { productId });

    const resultAction = await dispatch(
      updateProduct({
        id: productId,
        data: productData,
        token,
      })
    );

    if (updateProduct.fulfilled.match(resultAction)) {
      logger.info("Product updated successfully", { productId });
      return resultAction.payload;
    }

    if (updateProduct.rejected.match(resultAction)) {
      const errorMessage = resultAction.payload as string;
      logger.error("Product update failed", undefined, {
        productId,
        errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  return {
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    loading,
    error,
  };
}
