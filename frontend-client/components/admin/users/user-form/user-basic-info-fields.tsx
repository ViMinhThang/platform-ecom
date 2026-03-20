"use client";

import { Control } from "react-hook-form";
import { FormInput } from "@/components/admin/form-input";
import { FormSelect } from "@/components/admin/form-select";
import { UserFormValues } from "@/types/user/user.form";

interface UserBasicInfoFieldsProps {
    control: Control<UserFormValues>;
    loading: boolean;
}

/**
 * User Basic Information Fields
 * Handles username, email, and active status fields
 */
export const UserBasicInfoFields: React.FC<UserBasicInfoFieldsProps> = ({
    control,
    loading,
}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormInput
                control={control}
                name="username"
                label="Username"
                placeholder="Enter username"
                disabled={loading}
                required
            />

            <FormInput
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="user@example.com"
                disabled={loading}
                required
            />

            <FormSelect
                control={control}
                name="isActive"
                label="Status"
                options={[
                    { value: "true", label: "Active" },
                    { value: "false", label: "Inactive" },
                ]}
                disabled={loading}
            />
        </div>
    );
};
