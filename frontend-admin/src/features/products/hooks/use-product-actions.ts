import { useCreateProductMutation, useUpdateProductMutation } from "@/lib/store/api";

export function useProductActions() {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleCreateProduct = async (productData: {
    name: string;
    status: string;
    description?: string;
    cate?: Record<string, unknown>;
    specifications?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }) => {
    const result = await createProduct(productData as any).unwrap();
    return result;
  };

  const handleUpdateProduct = async (
    productId: number,
    productData: Partial<{
      name: string;
      status: string;
      description?: string;
      cate?: Record<string, unknown>;
      specifications?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }>
  ) => {
    const result = await updateProduct({ id: productId, data: productData as any }).unwrap();
    return result;
  };

  return {
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    loading: isCreating || isUpdating,
    error: null,
  };
}
