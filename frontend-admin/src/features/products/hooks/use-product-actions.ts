
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createProduct, updateProduct } from "@/services/product-service";
import { Product } from "@/types/product";

export function useProductActions() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleCreateProduct = async (productData: Omit<Product, "id">) => {
    if (!session) {
      setError(new Error("No session found"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProduct(productData, session.accessToken);
      return newProduct;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (productId: number, productData: Partial<Product>) => {
    if (!session) {
      setError(new Error("No session found"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProduct(productId, productData, session.accessToken);
      return updatedProduct;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    loading,
    error,
  };
}
