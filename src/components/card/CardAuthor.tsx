import React from "react";
import { IAuthor } from "@/services/types";
import Button from "@/components/button/Button";

export interface CardAuthorProps {
  author: IAuthor;
  onDelete?: () => void;
}

const CardAuthor: React.FC<CardAuthorProps> = ({ author, onDelete }) => {
  return (
    <div className="border rounded p-4 flex flex-col gap-2 shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{author.name}</h3>
      <p className="text-sm text-gray-600">Nacionalidad: {author.nationality}</p>
      <p className="text-sm text-gray-600">Año de nacimiento: {author.birthYear}</p>
      {onDelete && (
        <Button variant="danger" onClick={onDelete}>
          Eliminar
        </Button>
      )}
    </div>
  );
};

export default CardAuthor;
