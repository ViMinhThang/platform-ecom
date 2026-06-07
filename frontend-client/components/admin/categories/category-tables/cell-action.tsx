"use client";
import { AlertModal } from "@/components/admin/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types/category/category";
import { IconEdit, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { CategoryDialog } from "../category-form/category-dialog";
import { useDeleteCategoryMutation } from "@/lib/store/admin";

interface CellActionProps {
  data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [closeUpdateCategory, setCloseUpdateCategory] = useState(false);

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const onConfirm = async () => {
    try {
      await deleteCategory(data.id).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isDeleting}
      />
      <CategoryDialog
        categoryId={data.id}
        open={closeUpdateCategory}
        onOpenChange={() => setCloseUpdateCategory(false)}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Mở menu</span>
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setCloseUpdateCategory(true)}>
            <IconEdit className="mr-2 size-4" /> Cập nhật
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className="mr-2 size-4" /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
