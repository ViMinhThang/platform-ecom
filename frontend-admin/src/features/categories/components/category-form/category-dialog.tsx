"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
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
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  createCategory,
  fetchCategoryById,
  updateCategory,
} from "@/lib/store/slices/categorySlice";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

/**
 * Default form values for category
 */
const DEFAULT_FORM_VALUES: CategoryFormValues = {
  id: undefined,
  name: "",
  imageUrl: "",
};

/**
 * Category Dialog Component
 * Handles creating and updating categories
 */
export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  categoryId,
  open,
  onOpenChange,
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { selectedCategory: category, loading } = useAppSelector(
    (state) => state.categories
  );

  const isEditing = Boolean(categoryId);
  const dialogTitle = isEditing ? "Update Category" : "Create Category";
  const dialogDescription = isEditing
    ? "Update category details"
    : "Create a new category";

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  /**
   * Loads category data when editing
   */
  useEffect(() => {
    if (!open || !categoryId || !session?.accessToken) return;

    dispatch(fetchCategoryById({ id: categoryId, token: session.accessToken }));
  }, [open, categoryId, session, dispatch]);

  /**
   * Populates form with category data or resets to defaults
   */
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

  /**
   * Handles form submission
   */
  const handleSubmit = methods.handleSubmit(async (formData) => {
    if (!session?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const resultAction = isEditing && categoryId
        ? await dispatch(
          updateCategory({
            id: categoryId,
            data: formData as any,
            token: session.accessToken,
          })
        )
        : await dispatch(
          createCategory({
            data: formData as any,
            token: session.accessToken,
          })
        );

      if (
        createCategory.fulfilled.match(resultAction) ||
        updateCategory.fulfilled.match(resultAction)
      ) {
        toast.success(
          `Category ${isEditing ? "updated" : "created"} successfully`
        );
        onOpenChange(false);
      } else {
        toast.error(`Failed to ${isEditing ? "update" : "create"} category`);
      }
    } catch (error) {
      logger.error("Category form submission failed", error as Error, {
        isEditing,
        categoryId,
      });
      toast.error(`Failed to ${isEditing ? "update" : "create"} category`);
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || methods.formState.isSubmitting}
              >
                {loading || methods.formState.isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
