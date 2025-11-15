"use client";

import { useEffect, useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { getCategories } from "@/services/category-service";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/services/product-service";
import {
  ProductFormSchema,
  ProductFormValues,
} from "../../types/product/product-form";
import { useProductContext } from "@/providers/product-provider";
import { Product } from "@/types/product/product";
import { toast } from "sonner";
import { Category } from "@/types/category/category";

export const useProductForm = (
  productId?: number,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
) => {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [localProduct, setLocalProduct] = useState<Product | null>(null);

  const { createProductHandler, updateProductHandler } = useProductContext();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "DRAFT",
      cate: "{}",
      specifications: "{}",
      metadata: "{}",
    },
  });

  // Fetch categories only when dialog opens
  useEffect(() => {
    if (!open || !session) return;

    const fetchCategories = async () => {
      try {
        const catRes = await getCategories(session.accessToken, {});
        setCategories(catRes.content);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [open, session]);

  // Fetch product using service when dialog opens
  useEffect(() => {
    if (!open || !productId || !session) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId, session.accessToken);
        setLocalProduct(data);

        methods.reset({
          name: data.name,
          slug: data.slug,
          description: data.description,
          status: data.status,
          cate: JSON.stringify(data.cate || {}),
          specifications: JSON.stringify(data.specifications || {}, null, 2),
          metadata: JSON.stringify(data.metadata || {}, null, 2),
        });
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [open, productId, session, methods]);

  const onSubmit: SubmitHandler<ProductFormValues> = useCallback(
    async (values) => {
      if (!session?.accessToken) return;

      const payload = {
        ...values,
        cate: JSON.parse(values.cate || "{}"),
        specifications: JSON.parse(values.specifications || "{}"),
        metadata: JSON.parse(values.metadata || "{}"),
      };

      let result = null;
      if (productId) {
        // Use context handler which internally calls service
        result = await updateProductHandler(
          productId,
          payload,
          session.accessToken
        );
      } else {
        result = await createProductHandler(payload, session.accessToken);
      }
      toast.success(
        `Product ${productId ? "updated" : "created"} successfully!`
      );
      if (result) onOpenChange?.(false);
    },
    [
      session,
      productId,
      updateProductHandler,
      createProductHandler,
      onOpenChange,
    ]
  );

  return {
    methods,
    onSubmit,
    categories,
    loading: methods.formState.isSubmitting,
  };
};
