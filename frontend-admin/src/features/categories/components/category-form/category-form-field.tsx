"use client";

import { Control, useController } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { CategoryFormValues } from "@/types/category/category-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useCategoryContext } from "@/providers/category-provider";

interface CategoryFormFieldsProps {
  control: Control<CategoryFormValues>;
  loading: boolean;
  categoryId: number;
}

export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  control,
  loading,
  categoryId,
}) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken || "";
  const { uploadCategoryImage } = useCategoryContext();
  const {
    field: { value: imageUrl, onChange },
  } = useController({
    control,
    name: "imageUrl",
  });

  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      setUploading(true);

      const newImageUrl = await uploadCategoryImage(
        categoryId,
        file,
        accessToken
      );

      onChange(newImageUrl);
    } catch (err) {
      console.error("Failed to upload category image:", err);
    } finally {
      setUploading(false);
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        <FormInput
          control={control}
          name="name"
          label="Name"
          required
          placeholder="Enter category name"
        />
      </div>

      <div className="space-y-4">
        <div className="w-full h-48 border rounded-lg flex justify-center items-center overflow-hidden bg-gray-50">
          {imageUrl ? (
            <img
              src={`http://localhost:8080/uploads/${imageUrl}`}
              className="object-cover h-full w-full"
              alt="Category image"
            />
          ) : (
            <span className="text-gray-400">No image selected</span>
          )}
        </div>

        <Button
          type="button"
          disabled={uploading || loading}
          className="w-full"
          onClick={() =>
            document.getElementById("category-image-input")?.click()
          }
        >
          {uploading ? "Uploading..." : "Select Image"}
        </Button>

        <input
          id="category-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>
    </div>
  );
};
