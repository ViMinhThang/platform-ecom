import { useCreateProductMutation, useUpdateProductMutation } from "@/lib/store/api";
import type { Product, ProductRow } from "@/types/product";

export function useProductActions() {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductRow> => {
    const result = await createProduct(productData).unwrap();
    return result;
  };

  const handleUpdateProduct = async (
    productId: number,
    productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Product> => {
    const result = await updateProduct({ id: productId, data: productData }).unwrap();
    return result;
  };

  return {
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    loading: isCreating || isUpdating,
    error: null,
  };
}