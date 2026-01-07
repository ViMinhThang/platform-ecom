import * as z from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  status: z.enum(["DRAFT", "ACTIVE", "OUT_OF_STOCK"]),
  cate: z.string().min(1, "Category is required"),
  specifications: z.string().optional(),
  metadata: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export interface ProductDialogProps {
  productId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
