"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProductOption } from "@/types/product/product-option";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchOptions,
  createOption as createOptionAction,
  updateOption as updateOptionAction,
  deleteOption as deleteOptionAction,
  setCurrentProductId,
  clearOptions,
} from "@/lib/store/slices/productOptionSlice";

interface ProductOptionContextValue {
  options: ProductOption[];
  loading: boolean;
  productId: number;
  fetchOptions: () => Promise<void>;
  createOption: (option: ProductOption) => Promise<ProductOption | null>;
  updateOption: (
    optionId: number,
    option: ProductOption
  ) => Promise<ProductOption | null>;
  deleteOption: (optionId: number) => Promise<void>;
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
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Get state from Redux
  const { items: options, loading } = useAppSelector((state) => state.productOptions);

  const fetchOptionsData = async () => {
    if (!productId || !session?.accessToken) return;

    try {
      await dispatch(fetchOptions({ productId, token: session.accessToken })).unwrap();
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product options");
    }
  };

  const createOption = async (
    option: ProductOption
  ): Promise<ProductOption | null> => {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      const result = await dispatch(createOptionAction({
        productId,
        data: option,
        token: session.accessToken
      })).unwrap();

      toast.success("Option created successfully");
      return result;
    } catch (error: any) {
      console.error("Error creating option:", error);
      toast.error(error?.message || "Failed to create option");
      return null;
    }
  };

  const updateOption = async (
    optionId: number,
    option: ProductOption
  ): Promise<ProductOption | null> => {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      const result = await dispatch(updateOptionAction({
        productId,
        optionId,
        data: option,
        token: session.accessToken
      })).unwrap();

      toast.success("Option updated successfully");
      return result;
    } catch (error: any) {
      console.error("Error updating option:", error);
      toast.error(error?.message || "Failed to update option");
      return null;
    }
  };

  const deleteOption = async (optionId: number): Promise<void> => {
    if (!session?.accessToken) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await dispatch(deleteOptionAction({
        productId,
        optionId,
        token: session.accessToken
      })).unwrap();

      toast.success("Option deleted successfully");
    } catch (error) {
      console.error("Error deleting option:", error);
      toast.error("Failed to delete option");
    }
  };

  useEffect(() => {
    dispatch(setCurrentProductId(productId));
    fetchOptionsData();

    // Cleanup on unmount
    return () => {
      dispatch(clearOptions());
    };
  }, [productId, session?.accessToken, dispatch]);

  return (
    <ProductOptionContext.Provider
      value={{
        options,
        loading,
        productId,
        fetchOptions: fetchOptionsData,
        createOption,
        updateOption,
        deleteOption,
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
