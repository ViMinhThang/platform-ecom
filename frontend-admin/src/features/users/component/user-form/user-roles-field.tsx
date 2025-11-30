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
        if (session?.accessToken && allRoles.length === 0) {
            dispatch(fetchAllRoles({ token: session.accessToken }));
        }
    }, [dispatch, session, allRoles.length]);

    /**
     * Transforms roles to checkbox options format
     */
    const roleOptions = allRoles.map((role) => ({
        value: String(role.roleId),
        label: role.roleName.replace("ROLE_", ""),
    }));

    return (
        <FormCheckboxGroup
            control={control}
            name="roles"
            label="User Roles"
            options={roleOptions}
            disabled={loading}
        />
    );
};
