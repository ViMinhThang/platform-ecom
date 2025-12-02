"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchUserById,
  createUser,
  updateUser,
} from "@/lib/store/slices/userSlice";
import { UserFormFields } from "./user-form-fields";
import {
  UserDialogProps,
  UserFormSchema,
  UserFormValues,
} from "@/types/user/user.form";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { role, User } from "@/types/user/user";

/**
 * Default form values for creating a user
 */
const DEFAULT_FORM_VALUES: UserFormValues = {
  userId: undefined,
  username: "",
  email: "",
  imageUrl: "",
  isActive: "true",
  roles: [],
};

/**
 * Transforms user data to form values
 */
function transformUserToFormValues(
  user: User,
  availableRoles: role[]
): UserFormValues {
  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    imageUrl: user.imageUrl ?? "",
    isActive: String(user.isActive),
    roles: availableRoles
      .filter((role) => user.roles.some((r) => r.roleName === role.roleName))
      .map((role) => String(role.roleId)),
  };
}

/**
 * Transforms form values to user data payload
 */
function transformFormValuesToUserData(
  formValues: UserFormValues,
  availableRoles: role[]
) {
  return {
    ...formValues,
    roles: availableRoles
      .filter((role) => formValues.roles.includes(String(role.roleId)))
      .map((role) => ({ roleId: role.roleId, roleName: role.roleName })),
  };
}

/**
 * User Dialog Component
 * Handles creating and updating users
 */
export const UserDialog: React.FC<UserDialogProps> = ({
  userId,
  open,
  onOpenChange,
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Selectors
  const {
    selectedUser: user,
    loading,
    roles: allRoles,
  } = useAppSelector((state) => state.users);

  const isEditing = Boolean(userId);
  const dialogTitle = isEditing ? "Update User" : "Create User";
  const dialogDescription = isEditing
    ? "Update user information and roles"
    : "Create a new user account";

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  /**
   * Loads user data when editing
   */
  useEffect(() => {
    if (!open || !userId || !session?.accessToken) return;

    dispatch(fetchUserById({ id: userId, token: session.accessToken }));
  }, [open, userId, session, dispatch]);

  /**
   * Populates form with user data or resets to defaults
   */
  useEffect(() => {
    if (user && open && isEditing) {
      const formValues = transformUserToFormValues(user, allRoles);
      methods.reset(formValues);
    } else if (!isEditing && open) {
      methods.reset(DEFAULT_FORM_VALUES);
    }
  }, [user, open, methods, isEditing, allRoles]);

  /**
   * Handles form submission
   */
  const handleSubmit = methods.handleSubmit(async (formData) => {
    if (!session?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const userData = transformFormValuesToUserData(formData, allRoles);

      const resultAction = isEditing && userId
        ? await dispatch(
          updateUser({
            id: userId,
            data: userData,
            token: session.accessToken,
          })
        )
        : await dispatch(
          createUser({
            data: userData,
            token: session.accessToken,
          })
        );

      if (
        createUser.fulfilled.match(resultAction) ||
        updateUser.fulfilled.match(resultAction)
      ) {
        toast.success(`User ${isEditing ? "updated" : "created"} successfully`);
        onOpenChange(false);
      } else {
        toast.error(`Failed to ${isEditing ? "update" : "create"} user`);
      }
    } catch (error) {
      logger.error("User form submission failed", error as Error, {
        isEditing,
        userId,
      });
      toast.error(`Failed to ${isEditing ? "update" : "create"} user`);
    }
  });

  /**
   * Handles form errors
   */
  function handleFormError(errors: unknown) {
    logger.warn("User form validation errors", { errors });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} onError={handleFormError}>
            <UserFormFields
              control={methods.control}
              loading={loading}
              userId={userId}
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading || methods.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || methods.formState.isSubmitting}
              >
                {loading || methods.formState.isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update User"
                    : "Create User"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
