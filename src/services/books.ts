import axios, { AxiosError } from "axios";
import { IBook } from "./types";

const BASE_URL = "/api/books";

export const getBooks = async (filters?: Partial<IBook>): Promise<IBook[]> => {
  try {
    const res = await axios.get(BASE_URL, { params: filters });
    return res.data.data as IBook[];
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error getBooks:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const postBook = async (book: Partial<IBook>): Promise<IBook> => {
  try {
    const res = await axios.post(BASE_URL, book);
    return res.data.data as IBook;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error postBook:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateBook = async (book: Partial<IBook> & { idBook: string }): Promise<IBook> => {
  try {
    const res = await axios.put(BASE_URL, book);
    return res.data.data as IBook;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error updateBook:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteBook = async (idBook: string): Promise<void> => {
  try {
    await axios.delete(BASE_URL, { params: { idBook } });
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error deleteBook:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};
