import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/utils/useAuth";
import { IBook, IAuthor } from "@/services/types";
import { getBooks, deleteBook } from "@/services/books";
import { getAuthors, deleteAuthor } from "@/services/authors";
import CardBook from "@/components/card/CardBook";
import CardAuthor from "@/components/card/CardAuthor";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import FormBook from "@/components/form/FormBook";
import FormAuthor from "@/components/form/FormAuthor";
import EditModal from "@/components/modal/EditModal";
import { showSuccess, showError } from "@/utils/toast";

const DashboardPage: React.FC = () => {
  useAuth();

  const [activeTab, setActiveTab] = useState<"books" | "authors">("books");
  const [books, setBooks] = useState<IBook[]>([]);
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<IBook | null>(null);
  const [authorToEdit, setAuthorToEdit] = useState<IAuthor | null>(null);

  // --- Fetch Books ---
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Partial<IBook> = {};
      if (titleFilter) filters.title = titleFilter;
      if (categoryFilter) filters.category = categoryFilter;
      const data = await getBooks(filters);
      setBooks(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [titleFilter, categoryFilter]);

  // --- Fetch Authors ---
  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [fetchBooks, fetchAuthors]);

  // --- Handlers CRUD ---
  const handleDeleteBook = async (book: IBook) => {
    try {
      await deleteBook(book._id);
      showSuccess("Libro eliminado correctamente");
      fetchBooks();
    } catch (err: unknown) {
      if (err instanceof Error) showError(err.message);
    }
  };

  const handleDeleteAuthor = async (author: IAuthor) => {
    if (!author.authorId) return;
    try {
      await deleteAuthor(Number(author.authorId));
      showSuccess("Autor eliminado correctamente");
      fetchAuthors();
    } catch (err: unknown) {
      if (err instanceof Error) showError(err.message);
    }
  };

  const handleOpenEditBook = (book: IBook) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  const handleOpenEditAuthor = (author: IAuthor) => {
    setAuthorToEdit(author);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookToEdit(null);
    setAuthorToEdit(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="max-w-7xl mx-auto bg-[#F5F2EA]/95 backdrop-blur-sm rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#5C4033] tracking-tight">
          ABookalypse
        </h1>

        {/* --- Tabs --- */}
        <div className="flex justify-center gap-6 mb-10">
          <Button
            variant={activeTab === "books" ? "primary" : "secondary"}
            onClick={() => setActiveTab("books")}
            className={`px-8 py-2 rounded-full font-medium transition ${
              activeTab === "books"
                ? "bg-[#8B5E3C] text-white shadow"
                : "border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#F5F2EA]"
            }`}
          >
            Books
          </Button>
          <Button
            variant={activeTab === "authors" ? "primary" : "secondary"}
            onClick={() => setActiveTab("authors")}
            className={`px-8 py-2 rounded-full font-medium transition ${
              activeTab === "authors"
                ? "bg-[#8B5E3C] text-white shadow"
                : "border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#F5F2EA]"
            }`}
          >
            Authors
          </Button>
        </div>

        {/* TAB: BOOKS */}
        {activeTab === "books" && (
          <>
            {/* Filtros */}
            <div className="bg-white/80 text-[#5c4033] shadow-md rounded-xl border border-[#D3C3A3] p-6 mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
              <Input
                label="Filter by title"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                placeholder="Title"
                className="text-[#5C4033] placeholder-[#A67C52] focus:ring-[#8B5E3C]"
              />
              <Input
                label="Filter by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="Category"
                className="text-[#5C4033] placeholder-[#A67C52] focus:ring-[#8B5E3C]"
              />
              <Button
                onClick={fetchBooks}
                className="bg-[#8B5E3C] text-white hover:bg-[#A67C52] rounded-md px-6 py-2 shadow-md transition"
              >
                Apply Filters
              </Button>
            </div>

            {/* Libros */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-y-auto max-h-[75vh] pr-2">
              {books.map((book) => (
                <CardBook
                  key={book.idBook}
                  book={book}
                  authorName={
                    authors.find((a) => a.authorId === book.authorId)?.name ||
                    "Desconocido"
                  }
                  onDelete={() => handleDeleteBook(book)}
                  onEdit={() => handleOpenEditBook(book)} // 👈 abre modal
                />
              ))}
            </div>

            {/* Crear libro */}
            <div className="mt-12 max-w-xl mx-auto">
              <FormBook authors={authors} onSaved={fetchBooks} />
            </div>
          </>
        )}

        {/* TAB: AUTHORS */}
        {activeTab === "authors" && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md mb-10">
              <FormAuthor onSaved={fetchAuthors} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {authors.map((author) => (
                <CardAuthor
                  key={author.authorId}
                  author={author}
                  onDelete={() => handleDeleteAuthor(author)}
                  onEdit={() => handleOpenEditAuthor(author)} // 👈 abre modal
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal de edición */}
        <EditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={
            bookToEdit
              ? `Edit Book: ${bookToEdit.title}`
              : authorToEdit
              ? `Edit Author: ${authorToEdit.name}`
              : ""
          }
        >
          {bookToEdit && (
            <FormBook
              authors={authors}
              bookToEdit={bookToEdit}
              onSaved={() => {
                fetchBooks();
                handleCloseModal();
              }}
            />
          )}

          {authorToEdit && (
            <FormAuthor
              authorToEdit={authorToEdit}
              onSaved={() => {
                fetchAuthors();
                handleCloseModal();
              }}
            />
          )}
        </EditModal>

        {loading && <p className="mt-4 text-center">Cargando...</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
