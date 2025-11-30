"use client";
import { AlertModal } from "@/components/modal/alert-modal";
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
import { useAppDispatch } from "@/lib/store/hooks";
import { deleteCategory } from "@/lib/store/slices/categorySlice";
import { useSession } from "next-auth/react";

interface CellActionProps {
  data: Category;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [closeUpdateCategory, setCloseUpdateCategory] = useState(false);

  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const onConfirm = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      await dispatch(deleteCategory({ id: data.id, token: session.accessToken }));
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <CategoryDialog
        categoryId={data.id}
        open={closeUpdateCategory}
        onOpenChange={() => setCloseUpdateCategory(false)}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setCloseUpdateCategory(true)}>
            <IconEdit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
