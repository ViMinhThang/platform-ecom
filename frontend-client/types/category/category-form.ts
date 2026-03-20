import * as z from "zod";

export const CategoryFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  imageUrl: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export interface CategoryDialogProps {
  categoryId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
