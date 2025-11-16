// src/services/user.service.ts
import { role, User, UserResponse } from "@/types/user/user";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";



export const getUsers = async (
  token: string | undefined,
  params?: any
): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const createUser = async (
  data: Partial<User>,
  token: string
): Promise<User> => {
  const response = await axios.post<User>(API_BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const updateUser = async (
  userId: number,
  data: Partial<User>,
  token: string
): Promise<User> => {
  const response = await axios.put<User>(`${API_BASE_URL}/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteUser = async (userId: number, token: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchUser = async (userId: number, token: string): Promise<User> => {
  const response = await axios.get<User>(`${API_BASE_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const updateUserImage = async (
  userId: number,
  imageFile: File,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await axios.put<string>(
    `${API_BASE_URL}/${userId}/image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const fetchAllRoles = async (token: string | undefined): Promise<any> => {
  const response = await axios.get<any>(`${API_BASE_URL}/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.allRoles;
}