"use client";

import { Control, useController } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { FormCheckboxGroup } from "@/components/forms/form-checkbox-group";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/providers/user-provider";
import { useEffect, useState } from "react";
import { UserFormValues } from "@/types/user/user.form";
import { FormSelect } from "@/components/forms/form-select";

interface UserFormFieldsProps {
  control: Control<UserFormValues>;
  loading: boolean;
  userId: number;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  loading,
  userId,
}) => {

  const { uploadUserImage, allRoles } = useUserContext();

  const {
    field: { value: imageUrl, onChange: setImage },
  } = useController({ control, name: "imageUrl" });

  const {
    field: { value: roles, onChange: setRoles },
  } = useController({ control, name: "roles" });

  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadUserImage(userId, file);
      setImage(url);
    } catch (err) {
      console.error("Failed upload:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* username */}
      <FormInput
        control={control}
        name="username"
        label="Username"
        required
        placeholder="Enter username"
      />

      {/* email */}
      <FormInput
        control={control}
        name="email"
        label="Email"
        required
        placeholder="Enter email"
      />

      <FormCheckboxGroup
        control={control}
        name="roles"
        label="Roles"
        required
        options={
          Array.isArray(allRoles)
            ? allRoles.map((role) => ({
                label: role.roleName,
                value: String(role.roleId),
              }))
            : []
        }
        columns={2}
        showBadges={true}
      />
      <FormSelect
        control={control}
        name="isActive"
        label="Status"
        required
        options={[
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ]}
      />

      {/* image preview */}
      <div className="w-full h-48 border rounded-lg flex justify-center items-center overflow-hidden bg-gray-50">
        {imageUrl ? (
          <img
            src={`http://localhost:8080/uploads/${imageUrl}`}
            className="object-cover h-full w-full"
            alt="User image"
          />
        ) : (
          <span className="text-gray-400">No image selected</span>
        )}
      </div>

      {/* upload button */}
      <Button
        type="button"
        disabled={uploading || loading}
        className="w-full"
        onClick={() => document.getElementById("user-image-input")?.click()}
      >
        {uploading ? "Uploading..." : "Select Image"}
      </Button>

      <input
        id="user-image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
    </div>
  );
};
