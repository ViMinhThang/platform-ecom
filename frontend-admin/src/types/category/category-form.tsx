import * as z from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export interface CategoryDialogProps {
  categoryId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}