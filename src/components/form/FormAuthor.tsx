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
  const [nationality, setNationality] = useState(authorToEdit?.nationality || "");
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
        await postAuthor({ name, nationality, birthYear: Number(birthYear), isActive: true });
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
 <form onSubmit={handleSubmit} className="border rounded-lg p-6 mb-6 flex flex-col gap-4 w-full max-w-md bg-white shadow-md">

      <h2 className="font-bold text-lg text-gray-800">
        {authorToEdit ? "Editar Autor" : "Crear Autor"}
      </h2>

      {/* Nombre */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Stephen King"
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-50
                     focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 hover:border-gray-400 transition"
        />
      </div>

      {/* Nacionalidad */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">Nationality</label>
        <input
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="American"
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-50
                     focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 hover:border-gray-400 transition"
        />
      </div>

      {/* Año de nacimiento */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">Birth Year</label>
        <input
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value ? Number(e.target.value) : "")}
          placeholder="1947"
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-50
                     focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 hover:border-gray-400 appearance-none transition"
        />
      </div>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default FormAuthor;
