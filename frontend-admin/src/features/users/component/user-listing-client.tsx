"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/providers/user-provider";
import { UserTable } from "./user-tables";
import { columns } from "./user-tables/columns";

interface UserListingClientProps {
  token: string;
  searchParams?: {
    page: number;
    perPage: number;
    username: string | null;
    email: string | null;
  };
}

export default function UserListingClient({
  token,
  searchParams,
}: UserListingClientProps) {
  const { fetchUsers, users, totalItems, loading } = useUserContext();

  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );

  const filters = {
    page,
    perPage,
  };

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, token, page, perPage]);

  if (!users || users.length === 0)
    return <div>No users found.</div>;

  return (
    <UserTable
      data={users}
      totalItems={totalItems}
      columns={columns}
      onPageChange={setPage}
      onPerPageChange={setPerPage}
      currentPage={page}
      pageSize={perPage}
    />
  );
}
