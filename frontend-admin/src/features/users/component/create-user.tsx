"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { UserDialog } from "./user-form/user-dialog";

export const CreateUserButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-black text-xs md:text-sm"
      >
        <IconPlus className="mr-2 h-4 w-4" /> Add User
      </Button>
      <UserDialog
        open={open}
        onOpenChange={setOpen}
        userId={undefined}
      />
    </>
  );
};
