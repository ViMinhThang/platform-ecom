"use client";

import { Button } from "@/components/ui/button";
import { useCategoryContext } from "@/providers/category-provider";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCategoryButtonProps {
  token: string;
}

export const CreateCategoryButton: React.FC<CreateCategoryButtonProps> = ({
  token,
}) => {
  const { createCategoryHandler } = useCategoryContext();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const name = `dummy-${Date.now()}`;
    if (!name) return;

    setLoading(true);
    try {
      await createCategoryHandler({ name }, token);
      toast.success("Category created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreate}
      disabled={loading}
      className="bg-black text-xs md:text-sm"
    >
      <IconPlus className="mr-2 h-4 w-4" /> Add New
    </Button>
  );
};
