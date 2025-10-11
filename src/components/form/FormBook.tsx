import React, { useState } from "react";
import { IBook, IAuthor } from "@/services/types";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { postBook, updateBook } from "@/services/books";
import { showSuccess, showError } from "@/utils/toast";

interface FormBookProps {
  bookToEdit?: IBook; 
  authors: IAuthor[];
  onSaved?: () => void; 
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
        showSuccess("Book updated successfully");
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
        showSuccess("Book created successfully");
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
      className="bg-white/80 border border-[#D3C3A3] rounded-xl shadow-md p-6 mb-8 flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
 <h2 className="font-semibold text-xl text-[#8B5E3C] border-b border-[#D3C3A3] pb-2">
    {bookToEdit ? "✏️ Edit Book" : "Add New Book"}
  </h2>

      {/* Campo: Título */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Hobbit"       
  className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
/>

       
      </div>

      {/* Campo: Autor */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">Author</label>
        <select
          value={authorId || ""}
          onChange={(e) => setAuthorId(Number(e.target.value))}
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        >
          <option value="">Select an author</option>
          {authors.map((a) => (
            <option key={a.authorId} value={a.authorId} className="text-[#5C4033]">
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo: Categoría */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">
          Category
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Terror, Fiction..."
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        />
      </div>

      {/* Campo: Año de publicación */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">
          Published Year
        </label>
        <input
          type="number"
          value={publishedYear || ""}
          onChange={(e) =>
            setPublishedYear(e.target.value ? Number(e.target.value) : 0)
          }
          placeholder="1986"
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        />
      </div>

      {/* Campo: Copias disponibles */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">
          Available Copies
        </label>
        <input
          type="number"
          value={availableCopies || ""}
          onChange={(e) => setAvailableCopies(Number(e.target.value))}
          placeholder="10"
          className="border border-[#CBB89D] rounded-md p-2 text-sm 
  placeholder-[#A67C52] text-[#5C4033]
  focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition"
        />
      </div>

      {/* Campo: URL de imagen */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#5C4033] mb-1">
          Book Cover{" "}
        </label>
        <input
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="https://..."
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

export default FormBook;
