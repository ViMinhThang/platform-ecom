"use client";

import { Control, useController } from "react-hook-form";
import { UserFormValues } from "@/types/user/user.form";
import { UserBasicInfoFields } from "./user-basic-info-fields";
import { UserImageUploadField } from "./user-image-upload-field";
import { UserRolesField } from "./user-roles-field";


interface UserFormFieldsProps {
  control: Control<UserFormValues>;
  loading: boolean;
  userId: number | null | undefined;
}

/**
 * User Form Fields Container
 * Orchestrates all user form field components
 */
export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  loading,
  userId,
}) => {
  const {
    field: { value: imageUrl, onChange: setImage },
  } = useController({ control, name: "imageUrl" });

  return (
    <div className="space-y-6">
      <UserBasicInfoFields control={control} loading={loading} />

      <UserImageUploadField
        imageUrl={imageUrl}
        setImage={setImage}
        userId={userId}
        loading={loading}
      />

      <UserRolesField control={control} loading={loading} />
    </div>
  );
};
