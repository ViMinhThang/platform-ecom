"use client";

import { useState, useCallback } from "react";
import { Product } from "@/types/product";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "@/services/product-service";

export interface UseProductResult {
  loading: boolean;
  product: Product | null;
  fetchProduct: (productId: number, token: string) => Promise<void>;
  createProductHandler: (data: any, token: string) => Promise<Product | null>;
  updateProductHandler: (
    productId: number,
    data: any,
    token: string
  ) => Promise<Product | null>;
}

/**
 * useProduct — custom hook to handle CRUD logic for a single product.
 */
export function useProduct(): UseProductResult {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  // Fetch product by ID
  const fetchProduct = useCallback(async (productId: number, token: string) => {
    setLoading(true);
    try {
      const res = await getProductById(productId, token);
      setProduct(res);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProductHandler = useCallback(
    async (data: any, token: string) => {
      setLoading(true);
      try {
        const created = await createProduct(data, token);
        setProduct(created);
        return created;
      } catch (error) {
        console.error("Failed to create product:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update product
  const updateProductHandler = useCallback(
    async (productId: number, data: any, token: string) => {
      setLoading(true);
      try {
        const updated = await updateProduct(productId, data, token);
        setProduct(updated);
        return updated;
      } catch (error) {
        console.error("Failed to update product:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    product,
    fetchProduct,
    createProductHandler,
    updateProductHandler,
  };
}
