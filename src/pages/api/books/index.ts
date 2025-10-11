import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbconnection";
import Book from "@/database/models/Book";
import Author from "@/database/models/Author";

interface BookFilter {
  authorId?: number;
  category?: { $regex: string; $options: string };
  title?: { $regex: string; $options: string };
  publishedYear?: number;
  availableCopies?: { $gte: number };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // --- GET: Listar libros con filtros, paginación y ordenamiento ---
  if (req.method === "GET") {
  try {
    const {
      authorId,
      category,
      title,
      publishedYear,
      availableCopies,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // Filtros dinámicos
    const filter: BookFilter = {};
    if (authorId) filter.authorId = Number(authorId);
    if (category) filter.category = { $regex: String(category), $options: "i" };
    if (title) filter.title = { $regex: String(title), $options: "i" };
    if (publishedYear) filter.publishedYear = Number(publishedYear);
    if (availableCopies) filter.availableCopies = { $gte: Number(availableCopies) };

    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;

    // 👇 Aquí eliminamos paginación y límite
    const books = await Book.find(filter)
      .populate("author")
      .sort({ [String(sort)]: sortOrder });

    res.status(200).json({
      ok: true,
      total: books.length,
      data: books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error al obtener libros" });
  }
}

  // --- POST: Crear libro ---
  else if (req.method === "POST") {
    try {
      const { idBook, title, authorId, category, publishedYear, availableCopies, img } = req.body;

      if (!idBook || !title || !authorId || !category || !publishedYear || availableCopies === undefined || !img) {
        return res.status(400).json({ ok: false, message: "Faltan campos obligatorios" });
      }

      if (Number(publishedYear) <= 0) {
        return res.status(400).json({ ok: false, message: "publishedYear debe ser un número válido" });
      }

      if (Number(availableCopies) < 0) {
        return res.status(400).json({ ok: false, message: "availableCopies no puede ser negativo" });
      }

      // Verificar unicidad del idBook
      const existing = await Book.findOne({ idBook });
      if (existing) return res.status(400).json({ ok: false, message: "El idBook ya existe" });

      // Verificar que el authorId exista
      const authorExists = await Author.findOne({ authorId });
      if (!authorExists) return res.status(400).json({ ok: false, message: "El authorId no existe" });

      const newBook = new Book({ idBook, title, authorId, category, publishedYear, availableCopies, img });
      await newBook.save();

      res.status(201).json({ ok: true, data: newBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al crear libro" });
    }
  }

  // --- PUT: Actualizar libro por _id o idBook ---
  else if (req.method === "PUT") {
    try {
      const { _id, idBook, ...rest } = req.body;
      console.log("PUT /api/books body:", req.body);
      if (!_id && !idBook) {
        console.log("Falta _id o idBook");
        return res.status(400).json({ ok: false, message: "Se requiere _id o idBook" });
      }

      if (rest.authorId) {
        const authorExists = await Author.findOne({ authorId: rest.authorId });
        if (!authorExists) {
          console.log("authorId no existe:", rest.authorId);
          return res.status(400).json({ ok: false, message: "El authorId no existe" });
        }
      }

      if (rest.publishedYear && Number(rest.publishedYear) <= 0) {
        console.log("publishedYear inválido:", rest.publishedYear);
        return res.status(400).json({ ok: false, message: "publishedYear debe ser un número válido" });
      }

      if (rest.availableCopies && Number(rest.availableCopies) < 0) {
        console.log("availableCopies negativo:", rest.availableCopies);
        return res.status(400).json({ ok: false, message: "availableCopies no puede ser negativo" });
      }

      let query;
      if (_id) {
        query = { _id: String(_id) };
      } else if (idBook) {
        query = { idBook: String(idBook) };
      }
      console.log("PUT /api/books query:", query);
      const updated = await Book.findOneAndUpdate(query, rest, { new: true }).populate("author");

      if (!updated) {
        console.log("Libro no encontrado para query:", query);
        return res.status(404).json({ ok: false, message: "Libro no encontrado" });
      }

      res.status(200).json({ ok: true, data: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al actualizar libro" });
    }
  }

  // --- DELETE: Eliminar libro por _id o idBook ---
  else if (req.method === "DELETE") {
    try {
      const { _id, idBook } = req.query;
      console.log("DELETE /api/books query params:", req.query);
      if (!_id && !idBook) {
        console.log("Falta _id o idBook");
        return res.status(400).json({ ok: false, message: "Se requiere _id o idBook" });
      }

      let query;
      if (_id) {
        query = { _id: String(_id).trim() };
      } else if (idBook) {
        query = { idBook: String(idBook).trim() };
      }
      console.log("DELETE /api/books query:", query);
      const deleted = await Book.findOneAndDelete(query);

      if (!deleted) {
        console.log("Libro no encontrado para query:", query);
        return res.status(404).json({ ok: false, message: "Libro no encontrado" });
      }

      res.status(200).json({ ok: true, message: "Libro eliminado correctamente", data: deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al eliminar libro" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ ok: false, message: `Método ${req.method} no permitido` });
  }
}
