"use client";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle, MapPin } from "lucide-react";
import { CellAction } from "./cell-action";
import { User, UserRow } from "@/types/user/user";
import Image from "next/image";

export const columns: ColumnDef<UserRow>[] = [
  {
    id: "image",
    header: "IMAGE",
    cell: ({ row }) => {
      const userRow = row.original;
      const imageUrl = userRow.imageUrl || "/placeholder.png";
      return (
        <div className="relative w-16 h-16">
          <Image
            src={`http://localhost:8080/uploads/${imageUrl}`}
            alt={userRow.username}
            fill
            className="object-cover rounded-md border"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "id",
  },
  {
    id: "username",
    accessorKey: "username",
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="username" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<UserRow["username"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search user...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="email" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<UserRow["email"]>()}</div>,
    meta: {
      label: "email",
      placeholder: "Search email...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<string>();
      return isActive === "true" ? (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle2 size={16} />
          Active
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle size={16} />
          Inactive
        </Badge>
      );
    },
    meta: {
      label: "Status",
      placeholder: "Filter by status...",
      variant: "select",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "roles",
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Roles" />
    ),
    cell: ({ cell }) => {
      const roles = cell.getValue<UserRow["roles"]>();
      return <div>{roles.map((role) => role.roleName).join(",")}</div>;
    },
    meta: {
      label: "Roles",
      placeholder: "Search roles...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "addresses",
    accessorKey: "addresses",
    header: ({ column }: { column: Column<UserRow, unknown> }) => (
      <DataTableColumnHeader column={column} title="Addresses" />
    ),
    cell: ({ cell }) => {
      const addresses = cell.getValue<UserRow["addresses"]>();
      const count = addresses?.length || 0;
      const defaultAddress = addresses?.find(addr => addr.isDefault);

      return (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{count} {count === 1 ? 'address' : 'addresses'}</span>
            {defaultAddress && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {defaultAddress.city}, {defaultAddress.country}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
