import React, { useState } from "react";
import { IAuthor } from "@/services/types";
import { postAuthor, updateAuthor } from "@/services/authors";
import { showSuccess, showError } from "@/utils/toast";
import Button from "@/components/button/Button";

interface FormAuthorProps {
  authorToEdit?: IAuthor;
  onSaved?: () => void;
}

const FormAuthor: React.FC<FormAuthorProps> = ({ authorToEdit, onSaved }) => {
  const [name, setName] = useState(authorToEdit?.name || "");
  const [nationality, setNationality] = useState(
    authorToEdit?.nationality || ""
  );
  const [birthYear, setBirthYear] = useState<number | "">(
    authorToEdit?.birthYear || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authorToEdit) {
        await updateAuthor({
          authorId: authorToEdit.authorId,
          name,
          nationality,
          birthYear: Number(birthYear),
        });
        showSuccess("Autor actualizado correctamente");
      } else {
        await postAuthor({
          name,
          nationality,
          birthYear: Number(birthYear),
          isActive: true,
        });
        showSuccess("Autor creado correctamente");
        setName("");
        setNationality("");
        setBirthYear("");
      }
      onSaved?.();
    } catch (err: unknown) {
      if (err instanceof Error) showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 border border-[#D3C3A3] rounded-xl shadow-md p-6 mb-8 flex flex-col gap-4"
    >
      <h2 className="font-bold text-lg text-[#5C4033]">
        {authorToEdit ? "Edit Author" : "Add Author"}
      </h2>

      {/* Nombre */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Stephen King"
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        />
      </div>

      {/* Nacionalidad */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">
          Nationality
        </label>
        <input
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="American"
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        />
      </div>

      {/* Año de nacimiento */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">
          Birth Year
        </label>
        <input
          type="number"
          value={birthYear}
          onChange={(e) =>
            setBirthYear(e.target.value ? Number(e.target.value) : "")
          }
          placeholder="1947"
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        />
      </div>

      <Button
        type="submit"
        className="bg-[#8B5E3C] hover:bg-[#A67C52] text-white rounded-md py-2 shadow-md transition"
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default FormAuthor;
