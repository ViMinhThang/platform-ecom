"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { VariantFormValues } from "@/types/product/product-variant";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useGetVariantsQuery, useCreateVariantMutation, useUpdateVariantMutation, useDeleteVariantMutation } from "@/lib/store/api";
import {
  addNewVariant,
  removeVariantLocally,
  updateVariantField as updateVariantFieldAction,
  setItems,
} from "@/lib/store/slices/productVariantSlice";

interface ProductVariantContextValue {
  variants: VariantFormValues[];
  loading: boolean;
  productId: number;
  addVariant: () => void;
  removeVariant: (variantKey: number | string | undefined) => void;
  handleChange: (
    variantKey: number | string,
    field: keyof VariantFormValues,
    value: unknown
  ) => void;
  saveVariant: (
    variant: VariantFormValues
  ) => Promise<VariantFormValues | null>;
  refetch: () => void;
}

const ProductVariantContext = createContext<
  ProductVariantContextValue | undefined
>(undefined);

interface ProductVariantProviderProps {
  productId: number;
  children: ReactNode;
}

export const ProductVariantProvider: React.FC<ProductVariantProviderProps> = ({
  productId,
  children,
}) => {
  const dispatch = useAppDispatch();
  const { items: localVariants } = useAppSelector((state) => state.productVariants);
  
  const { data: fetchedVariants, isLoading, refetch } = useGetVariantsQuery({ productId });
  const [createVariant] = useCreateVariantMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();

  const variants = fetchedVariants || localVariants || [];

  const addVariant = () => {
    dispatch(addNewVariant());
  };

  const removeVariant = async (variantId: number | string | undefined) => {
    try {
      if (typeof variantId === "number") {
        await deleteVariant({ productId, variantId }).unwrap();
        toast.success("Variant deleted successfully");
      } else {
        dispatch(removeVariantLocally(variantId));
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    }
  };

  const handleChange = (
    variantKey: number | string,
    field: keyof VariantFormValues,
    value: unknown
  ) => {
    dispatch(updateVariantFieldAction({ variantKey, field, value }));
  };

  const saveVariant = async (
    variant: VariantFormValues
  ): Promise<VariantFormValues | null> => {
    try {
      let result: VariantFormValues;

      if (variant.id) {
        result = await updateVariant({
          productId,
          variantId: variant.id,
          variantData: variant,
        }).unwrap();
        toast.success("Variant updated successfully");
      } else if (variant.tempId) {
        result = await createVariant({
          productId,
          variantData: variant,
        }).unwrap();
        toast.success("Variant created successfully");
      } else {
        return null;
      }

      return result;
    } catch (error: unknown) {
      console.error("Error saving variant:", error);
      toast.error("Failed to save variant");
      return null;
    }
  };

  return (
    <ProductVariantContext.Provider
      value={{
        variants,
        loading: isLoading,
        productId,
        addVariant,
        removeVariant,
        handleChange,
        saveVariant,
        refetch,
      }}
    >
      {children}
    </ProductVariantContext.Provider>
  );
};

export const useProductVariants = () => {
  const context = useContext(ProductVariantContext);
  if (!context)
    throw new Error(
      "useProductVariants must be used within a ProductVariantProvider"
    );
  return context;
};
