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
import { UserImageUploadField } from "./user-image-upload-field";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useController } from "react-hook-form";

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
  addresses: [],
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
    addresses: user.addresses || [],
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
 * User Summary Sidebar Component
 */
const UserSummarySidebar: React.FC<{
  methods: any;
  userId: number | null | undefined;
  loading: boolean;
}> = ({ methods, userId, loading }) => {
  const {
    field: { value: imageUrl, onChange: setImage },
  } = useController({ control: methods.control, name: "imageUrl" });

  const {
    field: { value: username },
  } = useController({ control: methods.control, name: "username" });

  const {
    field: { value: email },
  } = useController({ control: methods.control, name: "email" });

  const {
    field: { value: isActive },
  } = useController({ control: methods.control, name: "isActive" });

  return (
    <div className="bg-muted/50 p-6 rounded-lg space-y-6">
      <UserImageUploadField
        imageUrl={imageUrl}
        setImage={setImage}
        userId={userId}
        loading={loading}
      />

      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">
          {username || "New User"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {email || "No email set"}
        </p>
        {isActive === "true" ? (
          <Badge variant="default" className="flex items-center gap-1 w-fit mx-auto">
            <CheckCircle2 size={14} />
            Active
          </Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit mx-auto">
            <XCircle size={14} />
            Inactive
          </Badge>
        )}
      </div>
    </div>
  );
};

/**
 * User Dialog Component
 * Handles creating and updating users with enhanced split-view layout
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} onError={handleFormError}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(90vh-200px)] px-1">
              {/* Left Sidebar - User Summary */}
              <div className="md:col-span-1">
                <UserSummarySidebar
                  methods={methods}
                  userId={userId}
                  loading={loading}
                />
              </div>

              {/* Right Content - Form Fields with Tabs */}
              <div className="md:col-span-2">
                <UserFormFields
                  control={methods.control}
                  loading={loading}
                  userId={userId}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
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
