"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { VariantFormValues } from "@/types/product/product-variant";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchVariants,
  createVariant as createVariantAction,
  updateVariant as updateVariantAction,
  deleteVariant as deleteVariantAction,
  addNewVariant,
  removeVariantLocally,
  updateVariantField as updateVariantFieldAction,
  setCurrentProductId,
  clearVariants,
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
    value: any
  ) => void;
  saveVariant: (
    variant: VariantFormValues
  ) => Promise<VariantFormValues | null>;
  fetchVariants: () => Promise<void>;
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
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Get state from Redux
  const { items: variants, loading } = useAppSelector((state) => state.productVariants);

  const fetchVariantsData = async () => {
    if (!productId || !session?.accessToken) return;

    try {
      await dispatch(fetchVariants({ productId, token: session.accessToken })).unwrap();
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product variants");
    }
  };

  const addVariant = () => {
    dispatch(addNewVariant());
  };

  const removeVariant = async (variantId: number | string | undefined) => {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      if (typeof variantId === "number") {
        await dispatch(deleteVariantAction({
          productId,
          variantId,
          token: session.accessToken
        })).unwrap();
        toast.success("Variant deleted successfully");
      } else {
        // For temp variants, just remove locally
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
    value: any
  ) => {
    dispatch(updateVariantFieldAction({ variantKey, field, value }));
  };

  const saveVariant = async (
    variant: VariantFormValues
  ): Promise<VariantFormValues | null> => {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      let result: VariantFormValues;

      if (variant.id) {
        const variantId = variant.id;
        result = await dispatch(updateVariantAction({
          productId,
          variantId,
          data: variant,
          token: session.accessToken
        })).unwrap();
        toast.success("Variant updated successfully");
      } else {
        result = await dispatch(createVariantAction({
          productId,
          data: variant,
          token: session.accessToken
        })).unwrap();
        toast.success("Variant created successfully");
      }

      return result;
    } catch (error: any) {
      console.error("Error saving variant:", error);
      toast.error(error?.message || "Failed to save variant");
      return null;
    }
  };

  useEffect(() => {
    dispatch(setCurrentProductId(productId));
    fetchVariantsData();

    // Cleanup on unmount
    return () => {
      dispatch(clearVariants());
    };
  }, [productId, session?.accessToken]);

  return (
    <ProductVariantContext.Provider
      value={{
        variants,
        loading,
        productId,
        addVariant,
        removeVariant,
        handleChange,
        saveVariant,
        fetchVariants: fetchVariantsData,
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
