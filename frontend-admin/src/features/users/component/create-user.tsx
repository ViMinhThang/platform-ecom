"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/providers/user-provider";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateUserButtonProps {}

export const CreateUserButton: React.FC<CreateUserButtonProps> = ({}) => {
  const { createUserHandler, allRoles } = useUserContext();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const dummyUser = {
      username: `user-${Date.now()}`,
      email: `user-${Date.now()}@example.com`,
      roles: [allRoles.find((role) => role.roleName === "ROLE_USER")],
      password: "123456",
    };

    setLoading(true);
    try {
      await createUserHandler(dummyUser);
      toast.success("User created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreate}
      disabled={loading}
      className="bg-black text-xs md:text-sm"
    >
      <IconPlus className="mr-2 h-4 w-4" /> Add User
    </Button>
  );
};
