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
        className="bg-gray-950 text-xs md:text-sm"
      >
        <IconPlus className="mr-2 size-4" /> Thêm người dùng
      </Button>
      <UserDialog
        open={open}
        onOpenChange={setOpen}
        userId={undefined}
      />
    </>
  );
};
