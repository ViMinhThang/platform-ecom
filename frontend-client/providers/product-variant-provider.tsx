"use client";

import {
  createContext,
  use,
  ReactNode,
  useEffect,
  useCallback,
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
  clearVariants,
} from "@/lib/store/admin/slices/productVariantSlice";

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

  // Sync fetched variants to local Redux state
  const onVariantsLoaded = useCallback(() => {
    if (!fetchedVariants) return;
    dispatch(setItems(fetchedVariants as any));
  }, [fetchedVariants, dispatch]);

  useEffect(() => {
    onVariantsLoaded();
  }, [onVariantsLoaded]);

  // Clear variants when closing or switching products
  useEffect(() => {
    return () => {
      dispatch(clearVariants());
    };
  }, [productId, dispatch]);

  const variants = localVariants;

  const addVariant = () => {
    dispatch(addNewVariant());
  };

  const removeVariant = async (variantId: number | string | undefined) => {
    try {
      if (typeof variantId === "number") {
        await deleteVariant({ productId, variantId }).unwrap();
        toast.success("Đã xóa biến thể");
      } else {
        dispatch(removeVariantLocally(variantId));
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Không thể xóa biến thể");
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
        toast.success("Đã cập nhật biến thể");
      } else if (variant.tempId) {
        result = await createVariant({
          productId,
          variantData: variant,
        }).unwrap();
        toast.success("Đã tạo biến thể");
      } else {
        return null;
      }

      return result;
    } catch (error: unknown) {
      console.error("Error saving variant:", error);
      toast.error("Không thể lưu biến thể");
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
  const context = use(ProductVariantContext);
  if (!context)
    throw new Error(
      "useProductVariants phải được dùng bên trong ProductVariantProvider"
    );
  return context;
};
