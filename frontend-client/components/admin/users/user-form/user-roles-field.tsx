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
        ? allRoles
            .filter((role) => role && role.roleId != null && role.roleName)
            .map((role, index) => ({
                value: String(role.roleId),
                label: role.roleName.replace("ROLE_", ""),
                key: `role-${role.roleId}-${index}`,
            }))
        : [];

    if (isLoading || !allRoles || allRoles.length === 0) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium">User Roles <span className="text-red-500">*</span></label>
                <p className="text-sm text-muted-foreground">Loading roles...</p>
            </div>
        );
    }

    return (
        <FormCheckboxGroup
            control={control}
            name="roles"
            label="User Roles"
            options={roleOptions}
            disabled={loading}
            required
        />
    );
};
