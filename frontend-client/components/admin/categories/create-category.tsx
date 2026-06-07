"use client";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { CategoryDialog } from "./category-form/category-dialog";

interface CreateCategoryButtonProps {
  token?: string;
}

export const CreateCategoryButton: React.FC<CreateCategoryButtonProps> = ({ token }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="mr-2 size-4" /> Thêm mới
      </Button>
      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        categoryId={undefined}
      />
    </>
  );
};
