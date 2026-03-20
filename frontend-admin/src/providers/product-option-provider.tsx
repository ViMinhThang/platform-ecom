"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { ProductOption } from "@/types/product/product-option";
import { useGetOptionsQuery, useCreateOptionMutation, useUpdateOptionMutation, useDeleteOptionMutation } from "@/lib/store/api";

interface ProductOptionContextValue {
  options: ProductOption[];
  loading: boolean;
  productId: number;
  createOption: (option: ProductOption) => Promise<ProductOption | null>;
  updateOption: (
    optionId: number,
    option: ProductOption
  ) => Promise<ProductOption | null>;
  deleteOption: (optionId: number) => Promise<void>;
  refetch: () => void;
}

const ProductOptionContext = createContext<
  ProductOptionContextValue | undefined
>(undefined);

interface ProductOptionProviderProps {
  productId: number;
  children: ReactNode;
}

export const ProductOptionProvider: React.FC<ProductOptionProviderProps> = ({
  productId,
  children,
}) => {
  const { data: options = [], isLoading, refetch } = useGetOptionsQuery(productId);
  const [createOptionMutation] = useCreateOptionMutation();
  const [updateOptionMutation] = useUpdateOptionMutation();
  const [deleteOptionMutation] = useDeleteOptionMutation();

  const createOption = async (
    option: ProductOption
  ): Promise<ProductOption | null> => {
    try {
      const result = await createOptionMutation({
        productId,
        option,
      }).unwrap();

      toast.success("Option created successfully");
      return result;
    } catch (error) {
      console.error("Error creating option:", error);
      toast.error("Failed to create option");
      return null;
    }
  };

  const updateOption = async (
    optionId: number,
    option: ProductOption
  ): Promise<ProductOption | null> => {
    try {
      const result = await updateOptionMutation({
        productId,
        optionId,
        option,
      }).unwrap();

      toast.success("Option updated successfully");
      return result;
    } catch (error) {
      console.error("Error updating option:", error);
      toast.error("Failed to update option");
      return null;
    }
  };

  const deleteOption = async (optionId: number): Promise<void> => {
    try {
      await deleteOptionMutation({
        productId,
        optionId,
      }).unwrap();

      toast.success("Option deleted successfully");
    } catch (error) {
      console.error("Error deleting option:", error);
      toast.error("Failed to delete option");
    }
  };

  return (
    <ProductOptionContext.Provider
      value={{
        options,
        loading: isLoading,
        productId,
        createOption,
        updateOption,
        deleteOption,
        refetch,
      }}
    >
      {children}
    </ProductOptionContext.Provider>
  );
};

export const useProductOptions = () => {
  const context = useContext(ProductOptionContext);
  if (!context)
    throw new Error(
      "useProductOptions must be used within a ProductOptionProvider"
    );
  return context;
};
