import React from "react";
import { IAuthor } from "@/services/types";
import Button from "@/components/button/Button";

export interface CardAuthorProps {
  author: IAuthor;
  onDelete?: () => void;
  onEdit?: () => void; // 👈 nuevo
}

const CardAuthor: React.FC<CardAuthorProps> = ({ author, onDelete, onEdit }) => {
  return (
    <div className="bg-white border border-[#D3C3A3] rounded-lg shadow-md p-4 text-[#5C4033] flex flex-col hover:shadow-lg hover:scale-[1.02] transition-transform">
      <h3 className="font-bold text-lg text-[#8B5E3C] mb-2">{author.name}</h3>
      <p className="text-sm"><span className="font-semibold">Nationality:</span> {author.nationality}</p>
      <p className="text-sm"><span className="font-semibold">Birth Year:</span> {author.birthYear}</p>
      <p className="text-sm mb-2"><span className="font-semibold">Status:</span> {author.isActive ? "Active" : "Inactive"}</p>

      <div className="flex gap-2">
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
  );
};

export default CardAuthor;

