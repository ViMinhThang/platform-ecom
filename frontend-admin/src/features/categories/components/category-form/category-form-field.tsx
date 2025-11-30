"use client";

import { Control, useController } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { CategoryFormValues } from "@/types/category/category-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateCategoryImage } from "@/lib/store/slices/categorySlice";

interface CategoryFormFieldsProps {
  control: Control<CategoryFormValues>;
  loading: boolean;
  categoryId: number | null | undefined;
}

export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  control,
  loading,
  categoryId,
}) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken || "";
  const dispatch = useAppDispatch();
  const {
    field: { value: imageUrl, onChange },
  } = useController({
    control,
    name: "imageUrl",
  });

  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !categoryId) return; // Can't upload image without category ID

    setUploading(true);

    try {
      const resultAction = await dispatch(updateCategoryImage({
        id: categoryId,
        file,
        token: accessToken
      }));

      if (updateCategoryImage.fulfilled.match(resultAction)) {
        onChange(resultAction.payload.imageUrl);
      }
    } catch (err) {
      console.error("Failed to upload category image:", err);
    } finally {
      setUploading(false);
    }
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

      {categoryId && (
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
      )}
    </div>
  );
};
