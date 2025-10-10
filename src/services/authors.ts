import axios, { AxiosError } from "axios";
import { IAuthor } from "./types";

const BASE_URL = "/api/authors";

export const getAuthors = async (filters?: Partial<IAuthor>): Promise<IAuthor[]> => {
  try {
    const res = await axios.get(BASE_URL, { params: filters });
    return res.data.data as IAuthor[];
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error getAuthors:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const postAuthor = async (author: Partial<IAuthor>): Promise<IAuthor> => {
  try {
    const res = await axios.post(BASE_URL, author);
    return res.data.data as IAuthor;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error postAuthor:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateAuthor = async (author: Partial<IAuthor> & { authorId: number }): Promise<IAuthor> => {
  try {
    const res = await axios.put(BASE_URL, author);
    return res.data.data as IAuthor;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error updateAuthor:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteAuthor = async (authorId: number): Promise<void> => {
  try {
    await axios.delete(BASE_URL, { params: { authorId } });
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error deleteAuthor:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
