import React from "react";
import { IBook } from "@/services/types";
import Button from "@/components/button/Button";

export interface CardBookProps {
  book: IBook;
  authorName?: string;
  onDelete?: () => void;
  onEdit?: () => void; // 👈 nuevo
}

const CardBook: React.FC<CardBookProps> = ({ book, authorName, onDelete, onEdit }) => {
  return (
    <div
      className="bg-white border border-[#D3C3A3] rounded-lg shadow-md overflow-hidden 
      flex flex-col hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="w-full h-40 bg-[#F5F2EA] flex items-center justify-center overflow-hidden">
        <img
          src={book.img || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={book.title}
          className="object-contain w-full h-full"
          loading="lazy"
        />
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-bold text-base text-[#8B5E3C] mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-[#5C4033]"><span className="font-semibold">Author:</span> {authorName}</p>
          <p className="text-xs text-[#5C4033]"><span className="font-semibold">Category:</span> {book.category}</p>
          <p className="text-xs text-[#5C4033]"><span className="font-semibold">Published:</span> {book.publishedYear}</p>
          <p className="text-xs text-[#5C4033] mb-1"><span className="font-semibold">Copies:</span> {book.availableCopies}</p>
        </div>

        <div className="flex gap-2 mt-2">
          {onEdit && (
            <Button
              variant="secondary"
              className="flex-1 py-1 text-xs bg-[#8B5E3C] hover:bg-[#A67C52] text-white rounded-md"
              onClick={onEdit}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              className="flex-1 py-1 text-xs bg-[#B23A48] hover:bg-[#a0343f] text-white rounded-md"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardBook;

