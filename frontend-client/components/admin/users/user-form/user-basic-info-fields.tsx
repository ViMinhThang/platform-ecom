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
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
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
                label="Trạng thái"
                options={[
                    { value: "true", label: "Hoạt động" },
                    { value: "false", label: "Bị khóa" },
                ]}
                disabled={loading}
            />
        </div>
    );
};
