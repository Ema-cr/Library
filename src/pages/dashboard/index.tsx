// pages/dashboard/index.tsx
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
      await deleteBook(book.idBook);
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "books" ? "primary" : "secondary"}
          onClick={() => setActiveTab("books")}
        >
          Libros
        </Button>
        <Button
          variant={activeTab === "authors" ? "primary" : "secondary"}
          onClick={() => setActiveTab("authors")}
        >
          Autores
        </Button>
      </div>

      {/* Contenido Tabs */}
      {activeTab === "books" && (
        <>
          {/* Formulario para crear/editar libro */}
          <FormBook authors={authors} onSaved={fetchBooks} />

          {/* Filtros */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <Input
              label="Filtrar por título"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Título"
            />
            <Input
              label="Filtrar por categoría"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="Categoría"
            />
            <Button onClick={fetchBooks}>Filtrar</Button>
          </div>

          {/* Listado de libros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <CardBook
                key={book.idBook}
                book={book}
                onDelete={() => handleDeleteBook(book)}
              />
            ))}
          </div>
        </>
      )}

      {activeTab === "authors" && (
        <>
          {/* Formulario para crear/editar autor */}
          <FormAuthor onSaved={fetchAuthors} />

          {/* Listado de autores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author) => (
              <CardAuthor
                key={author.authorId}
                author={author}
                onDelete={() => handleDeleteAuthor(author)}
              />
            ))}
          </div>
        </>
      )}

      {loading && <p className="mt-4">Cargando...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default DashboardPage;
