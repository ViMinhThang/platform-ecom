"use client";

import { useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFormSchema,
  ProductFormValues,
} from "../../types/product/product-form";
import { toast } from "sonner";
import { useGetCategoriesQuery, useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation } from "@/lib/store/api";
import { logger } from "@/lib/logger";
import { Product } from "@/types/product/product";

interface UseProductFormParams {
  productId?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_FORM_VALUES: ProductFormValues = {
  name: "",
  status: "DRAFT",
  cate: "{}",
  specifications: "{}",
  metadata: "{}",
};

function transformProductToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    status: product.status as "DRAFT" | "ACTIVE" | "OUT_OF_STOCK",
    cate: JSON.stringify(product.cate || {}),
    specifications: JSON.stringify(product.specifications || {}, null, 2),
    metadata: JSON.stringify(product.metadata || {}, null, 2),
  };
}

function transformFormValuesToProduct(values: ProductFormValues) {
  const cateData = parseJsonOrDefault(values.cate, {});

  return {
    ...values,
    cate: Object.keys(cateData).length > 0 ? cateData : undefined,
    specifications: parseJsonOrDefault(values.specifications, {}),
    metadata: parseJsonOrDefault(values.metadata, {}),
  };
}

function parseJsonOrDefault<T>(jsonString: string | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.warn("Failed to parse JSON", { jsonString, error });
    return defaultValue;
  }
}

export const useProductForm = ({
  productId,
  open,
  onOpenChange,
}: UseProductFormParams) => {
  const { data: categories } = useGetCategoriesQuery({});
  
  const { data: productData } = useGetProductByIdQuery(productId!, {
    skip: !open || !productId,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (productData && productId) {
      const formValues = transformProductToFormValues(productData);
      methods.reset(formValues);
    }
  }, [productData, productId, methods]);

  const onSubmit: SubmitHandler<ProductFormValues> = useCallback(
    async (values) => {
      const payload = transformFormValuesToProduct(values);
      const isUpdate = Boolean(productId);

      try {
        const result = isUpdate
          ? await updateProduct({ id: productId!, data: payload as any }).unwrap()
          : await createProduct(payload as any).unwrap();

        toast.success(`Product ${isUpdate ? "updated" : "created"} successfully!`);
        onOpenChange?.(false);
      } catch (error) {
        logger.error("Product form submission failed", error as Error, {
          isUpdate,
          productId,
        });
        toast.error(`Failed to ${isUpdate ? "update" : "create"} product`);
      }
    },
    [productId, createProduct, updateProduct, onOpenChange]
  );

  const loading = isCreating || isUpdating || methods.formState.isSubmitting;

  return {
    methods,
    onSubmit,
    categories: categories?.content || [],
    loading,
  };
};
