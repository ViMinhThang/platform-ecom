"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CategoryDialogProps,
  CategoryFormSchema,
  CategoryFormValues,
} from "@/types/category/category-form";
import { CategoryFormFields } from "./category-form-field";
import { useGetCategoryByIdQuery, useCreateCategoryMutation, useUpdateCategoryMutation } from "@/lib/store/admin";
import { toast } from "sonner";

const DEFAULT_FORM_VALUES: CategoryFormValues = {
  id: undefined,
  name: "",
  imageUrl: "",
};

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  categoryId,
  open,
  onOpenChange,
}) => {
  const isEditing = Boolean(categoryId);
  const dialogTitle = isEditing ? "Cập nhật danh mục" : "Tạo danh mục mới";
  const dialogDescription = isEditing
    ? "Cập nhật thông tin chi tiết danh mục"
    : "Tạo một danh mục sản phẩm mới";

  const { data: category } = useGetCategoryByIdQuery(categoryId!, { skip: !open || !categoryId });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (category && open && categoryId) {
      methods.reset({
        name: category.name,
        imageUrl: category.imageUrl ?? "",
      });
    } else if (open && !categoryId) {
      methods.reset(DEFAULT_FORM_VALUES);
    }
  }, [category, open, methods, categoryId]);

  const loading = isCreating || isUpdating;

  const handleSubmit = methods.handleSubmit(async (formData) => {
    try {
      const data = {
        name: formData.name,
        imageUrl: formData.imageUrl || undefined,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      };
      
      if (isEditing && categoryId) {
        await updateCategory({ id: categoryId, data }).unwrap();
        toast.success("Cập nhật danh mục thành công");
      } else {
        await createCategory(data).unwrap();
        toast.success("Tạo danh mục thành công");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(`${isEditing ? "Cập nhật" : "Tạo mới"} danh mục thất bại`);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit}>
            <CategoryFormFields
              control={methods.control}
              loading={loading}
              categoryId={categoryId}
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading || methods.formState.isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || methods.formState.isSubmitting}
              >
                {loading || methods.formState.isSubmitting
                  ? "Đang lưu..."
                  : isEditing
                    ? "Cập nhật danh mục"
                    : "Tạo danh mục mới"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
