import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { DataTable } from "@/components/admin/users/data-table";

import { usersColumns } from "@/components/admin/users/columns";
import type { User } from "@/types/User";
import {
  useCreateUserMutation,
  useDeleteUserByIdMutation,
  useGetRolesQuery,
  useGetUsersQuery,
  useUpdateUserByIdMutation,
} from "@/slice/userApiSlice";
import type { Role } from "@/types/Roles";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const UsersAdmin = () => {
  const [createUser] = useCreateUserMutation();
  const [deleteUserById] = useDeleteUserByIdMutation();
  const [updateUserById] = useUpdateUserByIdMutation();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    userId: 0,
    username: "",
    email: "",
    password: "",
    isAvailable: "yes",
    roles: [{ roleId: "1", roleName: "ROLE_USER" }],
    addresses: [
      {
        addressId: 0,
        street: "",
        buildingName: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      },
    ],
  });

  const {
    data: users,
    isLoading,
    error,
  } = useGetUsersQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sortBy: "userName",
    sortOrder: "desc",
  });

  const { data: roles } = useGetRolesQuery({});

  const availableRoles: Role[] = roles ?? [];

  useEffect(() => {
    setPageNumber(0);
  }, [search]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        userId: selectedUser.userId,
        username: selectedUser.username,
        email: selectedUser.email,
        password: "",
        isAvailable: selectedUser.isAvailable ?? "yes",
        roles: selectedUser.roles ?? [],
        addresses: selectedUser.addresses ?? [],
      });
    }
  }, [selectedUser]);

  const safeAction = useCallback(
    async <T,>(
      action: () => Promise<T>,
      successMsg: string,
      failMsg: string
    ) => {
      try {
        await action();
        toast.success(successMsg);
      } catch (err) {
        console.error(err);
        toast.error(failMsg);
      }
    },
    []
  );

  const handleUpdateUsers = () => {
    if (!selectedUser) return;

    safeAction(
      () =>
        updateUserById({
          userId: selectedUser.userId,
          data: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            isAvailable: formData.isAvailable,
            roles: formData.roles,
            addresses: formData.addresses,
          },
        }).unwrap(),
      "User updated successfully!",
      "User update failed!"
    );
  };

  const handleDeleteUser = () =>
    selectedUser &&
    safeAction(
      () => deleteUserById(Number(selectedUser.userId)).unwrap(),
      "User deleted successfully!",
      "Delete failed!"
    );

  const handleCreateUser = () =>
    safeAction(
      () =>
        createUser({
          username: formData.username || `dummy${Date.now()}`,
          email: formData.email || `dummy${Date.now()}@example.com`,
          password: formData.password || "123456",
          isAvailable: formData.isAvailable,
          roles: formData.roles,
        }).unwrap(),
      "User created successfully!",
      "Failed to create user"
    );

  // Render content
  let content;
  if (isLoading) {
    content = <div className="text-center py-20">Loading...</div>;
  } else if (error) {
    content = (
      <div className="text-center py-20 text-red-500">
        Error loading users or no users
      </div>
    );
  } else {
    const filteredUsers = users?.content ?? [];
    content = (
      <>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No users found.
              <div className="mt-4">
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          ) : (
            <DataTable
              columns={usersColumns}
              data={filteredUsers}
              onRowClick={(row) => {
                navigate(`/admin/users/${row.original.userId}`);
                setSelectedUser(row.original);
              }}
            />
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => prev - 1)}
            disabled={pageNumber === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={filteredUsers.length < PAGE_SIZE}
          >
            Next
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-5 p-4 w-[1600px] border border-stale-200 rounded-lg">
      {/* Top summary bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Users</h1>
          <span className="text-sm text-gray-500">
            Total users: {users?.totalElements ?? 0}
          </span>
        </div>
        <Button onClick={handleCreateUser} className="ml-auto">
          Create user
        </Button>
      </div>

      {content}
    </div>
  );
};

export default UsersAdmin;
