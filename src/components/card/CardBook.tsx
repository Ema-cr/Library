import React from "react";
import { IBook } from "@/services/types";
import Button from "@/components/button/Button";

export interface CardBookProps {
  book: IBook;
  onDelete?: () => void;
}

const CardBook: React.FC<CardBookProps> = ({ book, onDelete }) => {
  return (
    <div className="border rounded p-4 flex flex-col gap-2 shadow hover:shadow-lg transition">
      <img
        src={book.img}
        alt={book.title}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="font-bold text-lg">{book.title}</h3>
      <p className="text-sm text-gray-600">Category: {book.category}</p>
      <p className="text-sm text-gray-600">Author Name: {book.name}</p>
      <p className="text-sm text-gray-600">Available Copies: {book.availableCopies}</p>
      {onDelete && (
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      )}
    </div>
  );
};

export default CardBook;

