import type { Role } from "@/types/Roles";
import type { User } from "@/types/User";
import type { ColumnDef } from "@tanstack/react-table";

export const usersColumns: ColumnDef<User>[] = [
  { accessorKey: "userId", header: "Id" },
  { accessorKey: "username", header: "Username" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];
      return roles.length > 0
        ? roles.map((r:Role) => r.roleName).join(", ")
        : "—";
    },
  },
];