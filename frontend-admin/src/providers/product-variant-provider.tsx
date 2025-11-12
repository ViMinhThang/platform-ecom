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

import {
  getProductVariants,
  updateVariant,
} from "@/services/product-variant-service";
import { VariantFormValues } from "@/types/product/product-variant";

interface ProductVariantContextValue {
  variants: (VariantFormValues & { variantId?: number })[];
  loading: boolean;
  productId:number,
  addVariant: () => void;
  removeVariant: (index: number) => void;
  handleChange: (
    index: number,
    field: keyof VariantFormValues,
    value: any
  ) => void;
  saveVariant: (index: number) => Promise<void>;
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
  const [variants, setVariants] = useState<
    (VariantFormValues & { variantId?: number })[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchVariants = async () => {
    if (!productId || !session?.accessToken) return;
    setLoading(true);
    try {
      const fetched = await getProductVariants(productId, session.accessToken!);
      setVariants(fetched.map((v: any) => ({ ...v, variantId: v.id })));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product variants");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof VariantFormValues,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: "",
        price: 0,
        stock: 0,
        isActive: true,
        optionValues: [],
        imageUrl: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const saveVariant = async (index: number): Promise<void> => {
    const variant = variants[index];
    if (!variant?.variantId) {
      toast.error("Missing variant ID");
      return;
    }
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await updateVariant(
        productId,
        variant.variantId,
        variant,
        session.accessToken
      );
      toast.success("Variant updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update variant");
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
