"use client";

import { Control, useController } from "react-hook-form";
import { FormCheckboxGroup } from "@/components/admin/form-checkbox-group";
import { UserFormValues } from "@/types/user/user.form";
import { useGetRolesQuery } from "@/lib/store/admin";

interface UserRolesFieldProps {
    control: Control<UserFormValues>;
    loading: boolean;
}

export const UserRolesField: React.FC<UserRolesFieldProps> = ({
    control,
    loading,
}) => {
    const { data: allRoles = [], isLoading } = useGetRolesQuery();

    const {
        field,
    } = useController({ control, name: "roles" });

    const roleOptions = Array.isArray(allRoles)
        ? allRoles.reduce<{ value: string; label: string; key: string }[]>((acc, role, index) => {
            if (role && role.roleId != null && role.roleName) {
              acc.push({
                value: String(role.roleId),
                label: role.roleName.replace("ROLE_", ""),
                key: `role-${role.roleId}-${index}`,
              });
            }
            return acc;
          }, [])
        : [];

    if (isLoading || !allRoles || allRoles.length === 0) {
        return (
            <div className="space-y-2">
                <p className="text-sm font-medium">Vai trò người dùng <span className="text-red-500">*</span></p>
                <p className="text-sm text-muted-foreground">Đang tải vai trò...</p>
            </div>
        );
    }

    return (
        <FormCheckboxGroup
            control={control}
            name="roles"
            label="Vai trò người dùng"
            options={roleOptions}
            disabled={loading}
            required
        />
    );
};
