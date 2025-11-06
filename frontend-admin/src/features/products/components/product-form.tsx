"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { JsonKeyValueEditor } from "./key-value-editor";
import { useSession } from "next-auth/react";
import { getCategories } from "@/services/category-service";
import { CategoryDTO } from "@/types/category";
import { useProduct } from "@/hooks/useProduct.ts";

interface ProductDialogProps {
  productId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ✅ Zod schema
const ProductFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(["DRAFT", "ACTIVE", "OUT_OF_STOCK"]),
  cate: z.string().min(1, "Category is required"),
  specifications: z.string().optional(),
  metadata: z.string().optional(),
});

type ProductFormValues = z.infer<typeof ProductFormSchema>;

export const ProductDialog: React.FC<ProductDialogProps> = ({
  productId,
  open,
  onOpenChange,
}) => {
  const { data: session, status: sessionStatus } = useSession();
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const {
    loading,
    product,
    fetchProduct,
    createProductHandler,
    updateProductHandler,
  } = useProduct();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "DRAFT",
      cate: "",
      specifications: "{}",
      metadata: "{}",
    },
  });

  useEffect(() => {
    if (!open || !session) return;

    (async () => {
      try {
        const catRes = await getCategories(session.accessToken);
        setCategories(catRes.content);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    })();
  }, [open, session]);

  useEffect(() => {
    if (open && session && productId && categories.length > 0) {
      fetchProduct(productId, session.accessToken as string);
    }
  }, [open, productId, session, categories, fetchProduct]);


  useEffect(() => {
    if (!product) return;

    const { name, slug, description, status, cate, specifications, metadata } =
      product;

    methods.reset({
      name,
      slug,
      description,
      status: status as any,
      cate: cate?.id?.toString() || "",
      specifications: JSON.stringify(specifications || {}, null, 2),
      metadata: JSON.stringify(metadata || {}, null, 2),
    });
  }, [product, methods]);


  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    if (!session) return;

    const payload = {
      ...values,
      cate: parseInt(values.cate, 10),
      specifications: JSON.parse(values.specifications || "{}"),
      metadata: JSON.parse(values.metadata || "{}"),
    };

    if (productId) {
      await updateProductHandler(
        productId,
        payload,
        session.accessToken as string
      );
    } else {
      await createProductHandler(payload, session.accessToken as string);
    }

    onOpenChange(false);
  };

  const statusOptions = [
    { label: "Draft", value: "DRAFT" },
    { label: "Active", value: "ACTIVE" },
    { label: "Out of Stock", value: "OUT_OF_STOCK" },
  ];

  const title = productId ? "Update Product" : "Create Product";

  if (sessionStatus === "loading") {
    return <div>Loading session...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{title} details below</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormInput
              control={methods.control}
              name="name"
              label="Name"
              required
              placeholder="Enter product name"
            />

            <FormInput
              control={methods.control}
              name="slug"
              label="Slug"
              required
              placeholder="Enter slug"
            />

            <FormTextarea
              control={methods.control}
              name="description"
              label="Description"
              placeholder="Enter product description"
              config={{ rows: 4, showCharCount: true, maxLength: 500 }}
            />

            <FormSelect
              control={methods.control}
              name="status"
              label="Status"
              required
              options={statusOptions}
            />

            <FormSelect
              control={methods.control}
              name="cate"
              label="Category"
              required
              disabled={categories.length === 0 || loading}
              options={categories.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              }))}
            />

            <JsonKeyValueEditor
              control={methods.control}
              name="specifications"
              label="Specifications"
            />

            <JsonKeyValueEditor
              control={methods.control}
              name="metadata"
              label="Metadata"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
