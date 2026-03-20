"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRow } from "@/types/user/user";
import { IconEdit, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { UserDialog } from "../user-form/user-dialog";
import { useDeleteUserMutation } from "@/lib/store/api";

interface CellActionProps {
  data: UserRow;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [closeUpdateUser, setCloseUpdateUser] = useState(false);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const onConfirm = async () => {
    try {
      await deleteUser(data.userId).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isDeleting}
      />
      <UserDialog
        userId={data.userId}
        open={closeUpdateUser}
        onOpenChange={() => setCloseUpdateUser(false)}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setCloseUpdateUser(true)}>
            <IconEdit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
