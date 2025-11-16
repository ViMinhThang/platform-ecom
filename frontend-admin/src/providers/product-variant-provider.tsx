"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  createVariant,
  deleteVariant,
  getProductVariants,
  updateVariant,
} from "@/services/product-variant-service";
import { VariantFormValues } from "@/types/product/product-variant";

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
  const [variants, setVariants] = useState<VariantFormValues[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVariants = async () => {
    if (!productId || !session?.accessToken) return;
    setLoading(true);
    try {
      const fetched = await getProductVariants(productId, session.accessToken!);
      // Add variantId for keying
      setVariants(
        fetched.map((v: any) => ({ ...v, variantId: v.id, tempId: v.tempId }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product variants");
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    const newVariant: VariantFormValues = {
      tempId: uuidv4(),
      sku: "",
      price: 0,
      stock: 0,
      isActive: true,
      optionValues: [],
      imageUrl: "",
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const removeVariant = async (variantId: number | string | undefined) => {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return null;
    }
    try {
      if (typeof variantId === "number") {
        await deleteVariant(productId, variantId, session.accessToken);
        toast.success("Variant deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
      return;
    } finally {
      setVariants((prev) =>
        prev.filter((v) => v.id !== variantId && v.tempId !== variantId)
      );
    }
  };

  const handleChange = (
    variantKey: number | string,
    field: keyof VariantFormValues,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantKey || v.tempId === variantKey
          ? { ...v, [field]: value }
          : v
      )
    );
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
        result = await updateVariant(
          productId,
          variantId,
          variant,
          session.accessToken
        );
        toast.success("Variant updated successfully");

        setVariants((prev) =>
          prev.map((v) =>
            v.id === result.id ? { ...result, variantId: result.id } : v
          )
        );
      } else {
        result = await createVariant(productId, variant, session.accessToken);
        toast.success("Variant created successfully");
        setVariants((prev) =>
          prev.map((v) =>
            v.tempId === variant.tempId
              ? { ...result, variantId: result.id }
              : v
          )
        );
      }

      return result;
    } catch (error: any) {
      console.error("Error saving variant:", error);
      toast.error(error?.response?.data?.message || "Failed to save variant");
      return null;
    }
  };

  useEffect(() => {
    fetchVariants();
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
        fetchVariants,
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
