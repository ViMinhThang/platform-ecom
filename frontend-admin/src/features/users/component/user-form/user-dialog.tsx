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

import { useUserContext } from "@/providers/user-provider";
import { UserFormFields } from "./user-form-fields";
import {
  UserDialogProps,
  UserFormSchema,
  UserFormValues,
} from "@/types/user/user.form";

export const UserDialog: React.FC<UserDialogProps> = ({
  userId,
  open,
  onOpenChange,
}) => {

  const { getUser, user, loading, updateUserHandler, allRoles } =
    useUserContext();

  const isEditing = Boolean(userId);
  const title = isEditing ? "Update User" : "Create User";

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      userId: userId || undefined,
      username: "",
      email: "",
      imageUrl: "",
      isActive: "true",
      roles: [],
    },
  });

  // Load user when dialog opens
  useEffect(() => {
    if (open && userId) getUser(userId);
  }, [open, userId]);

  // Populate form when user data arrives
  useEffect(() => {
    if (user && open) {
      methods.reset({
        userId: user.userId,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl ?? "",
        isActive: user.isActive ?? "true",
        roles: allRoles
          .filter((role) => user.roles.includes(role.roleName))
          .map((role) => String(role.roleId)),
      });
    }
  }, [user, open, methods]);
  function onError(errors: any, event?: any) {
    console.log(errors);
  }
  const onSubmit = methods.handleSubmit(async (data) => {
    console.log("Before mapping:", data);

    const finalData = {
      ...data,
      roles: allRoles.filter((role) =>
        data.roles.includes(String(role.roleId))
      ),
    };

    console.log("After mapping:", finalData);

    await updateUserHandler(userId, finalData);
    onOpenChange(false);
  }, onError);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update user details" : "Create a new user"}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <UserFormFields
              control={methods.control}
              loading={loading}
              userId={userId}
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
