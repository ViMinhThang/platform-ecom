"use client";

import { Control } from "react-hook-form";
import { UserFormValues } from "@/types/user/user.form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBasicInfoFields } from "./user-basic-info-fields";
import { UserRolesField } from "./user-roles-field";
import { UserAddressesField } from "./user-addresses-field";
import { ADMIN_CREATED_USER_DEFAULT_PASSWORD } from "@/constants/user-form.constants";
import { KeyRound } from "lucide-react";

interface UserFormFieldsProps {
  control: Control<UserFormValues>;
  loading: boolean;
  userId: number | null | undefined;
}

const DefaultPasswordNotice: React.FC = () => (
  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
    <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
      <KeyRound className="size-4" />
      Mật khẩu mặc định
    </h4>
    <p className="text-sm text-amber-600 dark:text-amber-300 mb-3">
      Tài khoản mới sẽ được tạo với mật khẩu mặc định bên dưới. Hãy thông báo cho người dùng và khuyến khích họ đổi mật khẩu sau khi đăng nhập lần đầu.
    </p>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Mật khẩu:</span>
      <code className="px-3 py-1.5 bg-background border rounded-md font-mono text-sm font-semibold tracking-wide">
        {ADMIN_CREATED_USER_DEFAULT_PASSWORD}
      </code>
    </div>
  </div>
);

/**
 * User Form Fields Container with Tabs
 * Orchestrates all user form field components in a tabbed layout
 */
export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  loading,
  userId,
}) => {
  const isCreating = !userId;

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
        <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
        <TabsTrigger value="security">Bảo mật</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4 mt-4">
        <UserBasicInfoFields control={control} loading={loading} />
        {isCreating && <DefaultPasswordNotice />}
        <UserRolesField control={control} loading={loading} />
      </TabsContent>

      <TabsContent value="addresses" className="mt-4">
        <UserAddressesField
          control={control}
          loading={loading}
          userId={userId}
        />
      </TabsContent>

      <TabsContent value="security" className="mt-4">
        {isCreating ? (
          <DefaultPasswordNotice />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Quản lý mật khẩu sẽ sớm có...</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
