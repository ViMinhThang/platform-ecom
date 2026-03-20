"use client";

import { useState } from "react";
import { UserTable } from "./user-tables";
import { columns } from "./user-tables/columns";
import { useGetUsersQuery } from "@/lib/store/api";

interface UserListingClientProps {
  searchParams?: {
    page: number;
    perPage: number;
    username: string | null;
    email: string | null;
  };
}

export default function UserListingClient({
  searchParams,
}: UserListingClientProps) {
  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );

  const { data, isLoading } = useGetUsersQuery({
    page,
    size: perPage,
  });

  const users = data?.content || [];
  const totalItems = data?.totalElements || 0;

  if (isLoading && users.length === 0)
    return <div>Loading users...</div>;

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
