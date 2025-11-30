"use client";

import { useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  ProductFormSchema,
  ProductFormValues,
} from "../../types/product/product-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createProduct,
  fetchProductById,
  updateProduct,
} from "@/lib/store/slices/productSlice";
import { fetchCategories } from "@/lib/store/slices/categorySlice";
import { logger } from "@/lib/logger";
import { Product } from "@/types/product/product";

/**
 * Parameters for useProductForm hook
 */
interface UseProductFormParams {
  productId?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Default values for product form
 */
const DEFAULT_FORM_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  status: "DRAFT",
  cate: "{}",
  specifications: "{}",
  metadata: "{}",
};

/**
 * Transforms Product data to form values
 */
function transformProductToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    status: product.status,
    cate: JSON.stringify(product.cate || {}),
    specifications: JSON.stringify(product.specifications || {}, null, 2),
    metadata: JSON.stringify(product.metadata || {}, null, 2),
  };
}

/**
 * Transforms form values to Product payload
 */
function transformFormValuesToProduct(values: ProductFormValues) {
  const cateData = parseJsonOrDefault(values.cate, {});

  return {
    ...values,
    cate: Object.keys(cateData).length > 0 ? cateData : undefined,
    specifications: parseJsonOrDefault(values.specifications, {}),
    metadata: parseJsonOrDefault(values.metadata, {}),
  };
}

/**
 * Safely parses JSON string with fallback
 */
function parseJsonOrDefault<T>(jsonString: string | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.warn("Failed to parse JSON", { jsonString, error });
    return defaultValue;
  }
}

/**
 * Determines success message based on action
 */
function getSuccessMessage(isUpdate: boolean): string {
  return `Product ${isUpdate ? "updated" : "created"} successfully!`;
}

/**
 * Determines error message based on action
 */
function getErrorMessage(isUpdate: boolean): string {
  return `Failed to ${isUpdate ? "update" : "create"} product`;
}

/**
 * Hook for managing product form state and operations
 */
export const useProductForm = ({
  productId,
  open,
  onOpenChange,
}: UseProductFormParams) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Selectors
  const categories = useAppSelector((state) => state.categories.items);
  const { loading: productLoading } = useAppSelector((state) => state.products);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  /**
   * Fetches categories when dialog opens
   */
  useEffect(() => {
    if (!open || !session?.accessToken) return;

    dispatch(fetchCategories({ token: session.accessToken }));
  }, [open, session, dispatch]);

  /**
   * Loads product data when editing
   */
  useEffect(() => {
    if (!open || !productId || !session?.accessToken) return;

    const loadProduct = async () => {
      try {
        const action = await dispatch(
          fetchProductById({ id: productId, token: session.accessToken! })
        );

        if (fetchProductById.fulfilled.match(action)) {
          const formValues = transformProductToFormValues(action.payload);
          methods.reset(formValues);
        }
      } catch (error) {
        logger.error("Failed to fetch product", error as Error, { productId });
        toast.error("Failed to load product data");
      }
    };

    loadProduct();
  }, [open, productId, session, dispatch, methods]);

  /**
   * Handles form submission
   */
  const onSubmit: SubmitHandler<ProductFormValues> = useCallback(
    async (values) => {
      if (!session?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      const payload = transformFormValuesToProduct(values);
      const isUpdate = Boolean(productId);

      try {
        // Type assertion needed due to complex cate field type mismatch
        const resultAction = isUpdate
          ? await dispatch(
            updateProduct({
              id: productId!,
              data: payload as any,
              token: session.accessToken,
            })
          )
          : await dispatch(
            createProduct({
              data: payload as any,
              token: session.accessToken,
            })
          );

        if (
          createProduct.fulfilled.match(resultAction) ||
          updateProduct.fulfilled.match(resultAction)
        ) {
          toast.success(getSuccessMessage(isUpdate));
          onOpenChange?.(false);
        } else {
          toast.error(getErrorMessage(isUpdate));
        }
      } catch (error) {
        logger.error("Product form submission failed", error as Error, {
          isUpdate,
          productId,
        });
        toast.error(getErrorMessage(isUpdate));
      }
    },
    [session, productId, dispatch, onOpenChange]
  );

  return {
    methods,
    onSubmit,
    categories,
    loading: productLoading || methods.formState.isSubmitting,
  };
};
