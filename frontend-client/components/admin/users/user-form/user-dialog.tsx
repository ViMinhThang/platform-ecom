"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetUserByIdQuery, useGetRolesQuery, useCreateUserMutation, useUpdateUserMutation } from "@/lib/store/admin";
import { UserFormFields } from "./user-form-fields";
import {
  UserDialogProps,
  UserFormSchema,
  UserFormValues,
} from "@/types/user/user.form";
import { toast } from "sonner";
import { role, User } from "@/types/admin/user/user";
import { UserImageUploadField } from "./user-image-upload-field";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useController } from "react-hook-form";

const DEFAULT_FORM_VALUES: UserFormValues = {
  userId: undefined,
  username: "",
  email: "",
  imageUrl: "",
  isActive: "true",
  roles: [],
  addresses: [],
};

function transformUserToFormValues(user: User): UserFormValues {
  const roleIds = user.roles
    ?.filter((r) => r.roleId != null)
    .map((r) => String(r.roleId)) || [];

  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    imageUrl: user.imageUrl ?? "",
    isActive: user.isActive === true ? "true" : "false",
    roles: roleIds,
    addresses: user.addresses || [],
  };
}

function transformFormValuesToUserData(formValues: UserFormValues, availableRoles: role[]): Partial<User> {
  return {
    ...formValues,
    isActive: formValues.isActive === "true",
    roles: Array.isArray(availableRoles)
      ? availableRoles
          .filter((role) => formValues.roles.includes(String(role.roleId)))
          .map((role) => ({ roleId: role.roleId, roleName: role.roleName }))
      : [],
  };
}

const UserSummarySidebar: React.FC<{
  methods: ReturnType<typeof useForm<UserFormValues>>;
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

export const UserDialog: React.FC<UserDialogProps> = ({
  userId,
  open,
  onOpenChange,
}) => {
  const isEditing = Boolean(userId);
  const dialogTitle = isEditing ? "Update User" : "Create User";
  const dialogDescription = isEditing
    ? "Update user information and roles"
    : "Create a new user account";

  const { data: user } = useGetUserByIdQuery(userId!, { skip: !open || !userId });
  const { data: roles = [] } = useGetRolesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (user && open && isEditing) {
      const formValues = transformUserToFormValues(user);
      methods.reset(formValues);
    } else if (!isEditing && open) {
      methods.reset(DEFAULT_FORM_VALUES);
    }
  }, [user, open, methods, isEditing]);

  const loading = isCreating || isUpdating;

  const handleSubmit = methods.handleSubmit(async (formData) => {
    try {
      const userData = transformFormValuesToUserData(formData, roles);

      if (isEditing && userId) {
        await updateUser({ id: userId, data: userData }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(userData).unwrap();
        toast.success("User created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} user`);
    }
  });

  const handleFormError = (errors: unknown) => {
    console.warn("Form validation errors", errors);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} onError={handleFormError}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(90vh-200px)] px-1">
              <div className="md:col-span-1">
                <UserSummarySidebar
                  methods={methods}
                  userId={userId}
                  loading={loading}
                />
              </div>

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
