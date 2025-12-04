"use client";

import { useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { useSession } from "next-auth/react";
import { FormCheckboxGroup } from "@/components/forms/form-checkbox-group";
import { UserFormValues } from "@/types/user/user.form";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllRoles } from "@/lib/store/slices/userSlice";

interface UserRolesFieldProps {
    control: Control<UserFormValues>;
    loading: boolean;
}

/**
 * User Roles Selection Field
 * Handles fetching and selecting user roles
 */
export const UserRolesField: React.FC<UserRolesFieldProps> = ({
    control,
    loading,
}) => {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const { roles: allRoles } = useAppSelector((state) => state.users);

    const {
        field: { value: roles, onChange: setRoles },
    } = useController({ control, name: "roles" });

    /**
     * Fetches available roles on component mount
     */
    useEffect(() => {
        if (session?.accessToken && (allRoles?.length ?? 0) === 0) {
            dispatch(fetchAllRoles({ token: session.accessToken }));
        }
    }, [dispatch, session, allRoles?.length]);

    /**
     * Transforms roles to checkbox options format
     */
    const roleOptions = (allRoles || [])
        .filter((role) => role && role.roleId != null && role.roleName) // Filter out invalid roles
        .map((role, index) => ({
            value: String(role.roleId),
            label: role.roleName.replace("ROLE_", ""),
            key: `role-${role.roleId}-${index}`, // Unique key with fallback
        }));

    // Show loading message if roles haven't loaded yet
    if (!allRoles || allRoles.length === 0) {
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
