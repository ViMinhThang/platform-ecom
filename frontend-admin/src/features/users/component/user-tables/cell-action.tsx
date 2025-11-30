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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserDialog } from "../user-form/user-dialog";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { deleteUser } from "@/lib/store/slices/userSlice";

interface CellActionProps {
  data: UserRow;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [closeUpdateUser, setCloseUpdateUser] = useState(false);

  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const onConfirm = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      await dispatch(deleteUser({ id: data.userId, token: session.accessToken }));
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
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
