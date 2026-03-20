"use client";

import { Control } from "react-hook-form";
import { UserFormValues } from "@/types/user/user.form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBasicInfoFields } from "./user-basic-info-fields";
import { UserRolesField } from "./user-roles-field";
import { UserAddressesField } from "./user-addresses-field";

interface UserFormFieldsProps {
  control: Control<UserFormValues>;
  loading: boolean;
  userId: number | null | undefined;
}

/**
 * User Form Fields Container with Tabs
 * Orchestrates all user form field components in a tabbed layout
 */
export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  control,
  loading,
  userId,
}) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4 mt-4">
        <UserBasicInfoFields control={control} loading={loading} />
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
        <div className="text-center text-muted-foreground py-8">
          <p>Password management coming soon...</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
