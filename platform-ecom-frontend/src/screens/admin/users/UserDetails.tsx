import { useEffect, useCallback } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  useDeleteUserByIdMutation,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
} from "@/slice/userApiSlice";
import type { UserFormValues } from "@/types/User";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductNameFromPath } from "@/util/util";
import { skipToken } from "@reduxjs/toolkit/query";

const UserDetailAdmin = () => {
  const [deleteUserById] = useDeleteUserByIdMutation();
  const [updateUserById] = useUpdateUserByIdMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getProductNameFromPath(location.pathname);
  const { data, isLoading, error } = useGetUserByIdQuery(userId ?? skipToken);

  const methods = useForm<UserFormValues>({
    defaultValues: data ?? {
      userId: 0,
      username: "",
      email: "",
      password: "",
      isAvailable: "yes",
      roles: [],
      addresses: [],
    },
  });
  const { handleSubmit, reset, control } = methods;

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const safeAction = useCallback(
    async <T,>(
      action: () => Promise<T>,
      successMsg: string,
      failMsg: string
    ) => {
      try {
        await action();
        toast.success(successMsg);
      } catch (err) {
        console.error(err);
        toast.error(failMsg);
      }
    },
    []
  );

  const handleDeleteUser = async () => {
    if (!data) return;
    await safeAction(
      () => deleteUserById(Number(data.userId)).unwrap(),
      "User deleted successfully!",
      "Delete failed!"
    );
    navigate("/admin/users");
  };

  const onSubmit = async (formData: UserFormValues) => {
    console.log(formData);
    await safeAction(
      () =>
        updateUserById({
          userId: formData.userId,
          data: formData,
        }).unwrap(),
      "User updated successfully!",
      "User update failed!"
    );
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 flex flex-col gap-8 bg-slate-50 min-h-screen w-screen"
      >
        <h1 className="text-3xl font-bold">Edit User</h1>

        {/* Basic Info */}
        <Card className="w-[85%]">
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <FormField name="username" control={control} label="Username" />
            <FormField
              name="email"
              control={control}
              label="Email"
              type="email"
            />
            <FormField
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="******"
            />
            <div>
              <Label>Available</Label>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <select {...field} className="border p-2 rounded-md w-full">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card className="w-[85%]">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <>
                  {["ROLE_USER", "ROLE_ADMIN"].map((roleName, i) => (
                    <label key={roleName} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value.some(
                          (r) => r.roleName === roleName
                        )}
                        onChange={(e) =>
                          e.target.checked
                            ? field.onChange([
                                ...field.value,
                                { roleId: String(i + 1), roleName },
                              ])
                            : field.onChange(
                                field.value.filter(
                                  (r) => r.roleName !== roleName
                                )
                              )
                        }
                      />
                      {roleName}
                    </label>
                  ))}
                </>
              )}
            />
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="w-[85%]">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {fields.map((addr, index) => (
              <div key={addr.id} className="border p-4 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Row 1 */}
                  <FormField
                    name={`addresses.${index}.street`}
                    control={control}
                    label="Street"
                  />
                  <FormField
                    name={`addresses.${index}.buildingName`}
                    control={control}
                    label="Building"
                  />

                  {/* Row 2 */}
                  <FormField
                    name={`addresses.${index}.city`}
                    control={control}
                    label="City"
                  />
                  <FormField
                    name={`addresses.${index}.state`}
                    control={control}
                    label="State"
                  />

                  {/* Row 3 */}
                  <FormField
                    name={`addresses.${index}.country`}
                    control={control}
                    label="Country"
                  />
                  <FormField
                    name={`addresses.${index}.pinCode`}
                    control={control}
                    label="Pin Code"
                  />
                </div>

                <div className="flex justify-end mt-3">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  street: "",
                  buildingName: "",
                  city: "",
                  state: "",
                  country: "",
                  pinCode: "",
                })
              }
            >
              Add Address
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            onClick={handleDeleteUser}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

/* 🔹 Small reusable FormField */
const FormField = ({
  name,
  control,
  label,
  type = "text",
  placeholder,
}: {
  name: string;
  control: any;
  label: string;
  type?: string;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <Label>{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input type={type} placeholder={placeholder} {...field} />
      )}
    />
  </div>
);

export default UserDetailAdmin;
