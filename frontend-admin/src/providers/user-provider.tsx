"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { role, User } from "@/types/user/user";
import {
  createUser,
  deleteUser,
  fetchAllRoles,
  fetchUser,
  getUsers,
  updateUser,
  updateUserImage,
} from "@/services/user-service";
import { useSession } from "next-auth/react";

interface UserContextValue {
  users: User[];
  totalItems: number;
  loading: boolean;
  user: User | null;
  allRoles: role[];
  getAllRoles: () => Promise<void>;
  fetchUsers: ( params?: any) => Promise<void>;
  getUser: (userId: number) => Promise<void | null>;
  createUserHandler: (data: any) => Promise<User | null>;
  updateUserHandler: (
    userId: number,
    data: any,
  ) => Promise<User | null>;
  deleteUserHandler: (userId: number) => Promise<void>;
  uploadUserImage: (
    userId: number,
    imageFile: File,
  ) => Promise<string>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [allRoles, setAllRoles] = useState<role[]>([]);
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  console.log(token)
  const getUser = useCallback(async (userId: number) => {
    setLoading(true);
    try {
      const res = await fetchUser(userId, token);
      setUser(res);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getAllRoles();
  }, [token]);

  // console.log for debugging
  console.log("allRoles:", allRoles);

  const createUserHandler = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const created = await createUser(data, token);
      setUsers((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.error("Failed to create user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateUserHandler = useCallback(
    async (userId: number, data: any) => {
      setLoading(true);
      try {
        const updated = await updateUser(userId, data, token);
        setUser(updated);
        setUsers((prev) =>
          prev.map((u) => (u.userId === userId ? updated : u))
        );
        return updated;
      } catch (error) {
        console.error("Failed to update user:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchUsers = useCallback(
    async (params?: any) => {
      setLoading(true);
      try {
        const data = await getUsers(token, params);
        setUsers(data.content);
        setTotalItems(data.totalElements);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const deleteUserHandler = useCallback(
    async (userId: number) => {
      setLoading(true);
      try {
        await deleteUser(userId, token);
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const uploadUserImage = useCallback(
    async (userId: number, imageFile: File) => {
      setLoading(true);
      try {
        const res = await updateUserImage(userId, imageFile, token);
        setUser((prev) => (prev ? { ...prev, imageUrl: res } : null));
        setUsers((prev) =>
          prev.map((u) => (u.userId === userId ? { ...u, imageUrl: res } : u))
        );
        return res;
      } catch (error) {
        console.error("Failed to upload user image:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const getAllRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllRoles(token);
      setAllRoles(res);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        users,
        totalItems,
        loading,
        user,
        allRoles,
        getAllRoles,
        fetchUsers,
        getUser,
        createUserHandler,
        uploadUserImage,
        updateUserHandler,
        deleteUserHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within a UserProvider");
  return context;
};
