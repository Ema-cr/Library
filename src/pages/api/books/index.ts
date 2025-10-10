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
      const { authorId, category, title, publishedYear, availableCopies, page = "1", limit = "10", sort = "createdAt", order = "desc" } = req.query;

      const filter: BookFilter = {};
      if (authorId) filter.authorId = Number(authorId);
      if (category) filter.category = { $regex: String(category), $options: "i" };
      if (title) filter.title = { $regex: String(title), $options: "i" };
      if (publishedYear) filter.publishedYear = Number(publishedYear);
      if (availableCopies) filter.availableCopies = { $gte: Number(availableCopies) };

      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Number(limit));
      const skip = (pageNum - 1) * limitNum;
      const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;

      const books = await Book.find(filter)
        .populate("author")
        .sort({ [String(sort)]: sortOrder })
        .skip(skip)
        .limit(limitNum);

      const total = await Book.countDocuments(filter);

      res.status(200).json({
        ok: true,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
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

      if (!_id && !idBook) return res.status(400).json({ ok: false, message: "Se requiere _id o idBook" });

      if (rest.authorId) {
        const authorExists = await Author.findOne({ authorId: rest.authorId });
        if (!authorExists) return res.status(400).json({ ok: false, message: "El authorId no existe" });
      }

      if (rest.publishedYear && Number(rest.publishedYear) <= 0) {
        return res.status(400).json({ ok: false, message: "publishedYear debe ser un número válido" });
      }

      if (rest.availableCopies && Number(rest.availableCopies) < 0) {
        return res.status(400).json({ ok: false, message: "availableCopies no puede ser negativo" });
      }

      const query = _id ? { _id } : { idBook };
      const updated = await Book.findOneAndUpdate(query, rest, { new: true }).populate("author");

      if (!updated) return res.status(404).json({ ok: false, message: "Libro no encontrado" });

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

      if (!_id && !idBook) return res.status(400).json({ ok: false, message: "Se requiere _id o idBook" });

      const query = _id ? { _id: String(_id) } : { idBook: String(idBook) };
      const deleted = await Book.findOneAndDelete(query);

      if (!deleted) return res.status(404).json({ ok: false, message: "Libro no encontrado" });

      res.status(200).json({ ok: true, message: "Libro eliminado correctamente", data: deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al eliminar libro" });
    }
  }

  // --- Otros métodos ---
  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ ok: false, message: `Método ${req.method} no permitido` });
  }
}
