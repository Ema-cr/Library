// components/form/FormBook.tsx
import React, { useState } from "react";
import { IBook, IAuthor } from "@/services/types";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { postBook, updateBook } from "@/services/books";
import { showSuccess, showError } from "@/utils/toast";

interface FormBookProps {
  bookToEdit?: IBook; // opcional para editar
  authors: IAuthor[];
  onSaved?: () => void; // callback después de guardar
}

const FormBook: React.FC<FormBookProps> = ({
  bookToEdit,
  authors,
  onSaved,
}) => {
  const [title, setTitle] = useState(bookToEdit?.title || "");
  const [authorId, setAuthorId] = useState(bookToEdit?.authorId || 0);
  const [category, setCategory] = useState(bookToEdit?.category || "");
  const [publishedYear, setPublishedYear] = useState(
    bookToEdit?.publishedYear || 0
  );
  const [availableCopies, setAvailableCopies] = useState(
    bookToEdit?.availableCopies || 0
  );
  const [img, setImg] = useState(bookToEdit?.img || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bookToEdit) {
        await updateBook({
          idBook: bookToEdit.idBook,
          title,
          authorId,
          category,
          publishedYear,
          availableCopies,
          img,
        });
        showSuccess("Libro actualizado correctamente");
      } else {
        const idBook = "book-" + Date.now(); // generar id único
        await postBook({
          idBook,
          title,
          authorId,
          category,
          publishedYear,
          availableCopies,
          img,
        });
        showSuccess("Libro creado correctamente");
        // limpiar formulario
        setTitle("");
        setAuthorId(0);
        setCategory("");
        setPublishedYear(0);
        setAvailableCopies(0);
        setImg("");
      }
      if (onSaved) onSaved();
    } catch (err: unknown) {
      if (err instanceof Error) showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-md mx-auto border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <h2 className="font-semibold text-base text-gray-900 text-center mb-2">
        {bookToEdit ? "Editar Libro" : "Crear Libro"}
      </h2>

      {/* Campo: Título */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. El Resplandor"
          className="border border-gray-300 rounded-md p-2 text-sm placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Campo: Autor */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">Author</label>
        <select
          value={authorId || ""}
          onChange={(e) => setAuthorId(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-2 text-sm 
               text-gray-700 bg-gray-50
               focus:outline-none focus:ring-1 focus:ring-blue-400
               focus:border-blue-400 hover:border-gray-400
               transition"
        >
          <option value="">Select an author</option>
          {authors.map((a) => (
            <option key={a.authorId} value={a.authorId}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo: Categoría */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">
          Category
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Terror, Fiction..."
          className="border border-gray-300 rounded-md p-2 text-sm placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Campo: Año de publicación */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">
          Published Year
        </label>
        <input
          type="number"
          value={publishedYear || ""}
          onChange={(e) =>
            setPublishedYear(e.target.value ? Number(e.target.value) : 0)
          }
          placeholder="1986"
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Campo: Copias disponibles */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">
          Available Copies
        </label>
        <input
          type="number"
          value={availableCopies || ""}
          onChange={(e) => setAvailableCopies(Number(e.target.value))}
          placeholder="Ej: 10"
          className="border border-gray-300 rounded-md p-2 text-sm
               text-gray-700 placeholder-gray-600 bg-gray-50
               focus:outline-none focus:ring-1 focus:ring-blue-400
               focus:border-blue-400 hover:border-gray-400
               appearance-none transition"
        />
      </div>

      {/* Campo: URL de imagen */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-1">
          Book Cover{" "}
        </label>
        <input
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="https://..."
          className="border border-gray-300 rounded-md p-2 text-sm placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
};

export default FormBook;
