"use client";

import { useEffect, useState } from "react";
import { UserTable } from "./user-tables";
import { columns } from "./user-tables/columns";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchUsers } from "@/lib/store/slices/userSlice";

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
  const dispatch = useAppDispatch();
  const { items: users, pagination, loading } = useAppSelector((state) => state.users);
  const totalItems = pagination.totalElements;

  const [page, setPage] = useState<number>(Number(searchParams?.page ?? 0));
  const [perPage, setPerPage] = useState<number>(
    Number(searchParams?.perPage ?? 10)
  );

  useEffect(() => {
    if (!token) return;

    dispatch(fetchUsers({
      token,
      params: {
        page,
        size: perPage
      }
    }));
  }, [dispatch, token, page, perPage, searchParams]);

  if (loading && users.length === 0)
    return <div>Loading users...</div>;

  const mappedUsers = users;

  return (
    <UserTable
      data={mappedUsers}
      totalItems={totalItems}
      columns={columns}
      onPageChange={setPage}
      onPerPageChange={setPerPage}
      currentPage={page}
      pageSize={perPage}
    />
  );
}
