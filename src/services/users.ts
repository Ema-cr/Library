import axios, { AxiosError } from "axios";
import { IUser } from "./types";

const BASE_URL = "/api/users";

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data.data as IUser[];
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error getUsers:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const postUser = async (user: Partial<IUser>): Promise<IUser> => {
  try {
    const res = await axios.post(BASE_URL, user);
    return res.data.data as IUser;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error postUser:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateUser = async (user: Partial<IUser> & { id: number }): Promise<IUser> => {
  try {
    const res = await axios.put(BASE_URL, user);
    return res.data.data as IUser;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error updateUser:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axios.delete(BASE_URL, { params: { id } });
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error deleteUser:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
