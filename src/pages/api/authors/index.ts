import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbconnection";
import Author from "@/database/models/Author";
import mongoose from "mongoose";

// 📌 Interfaz para el filtro (en lugar de usar "any")
interface AuthorFilter {
  name?: { $regex: string; $options: string };
  nationality?: { $regex: string; $options: string };
  isActive?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Conexión a MongoDB

  // --- 📍 MÉTODO GET: Listar autores con filtros opcionales ---
  if (req.method === "GET") {
    try {
      const { name, nationality, isActive } = req.query;

      const filter: AuthorFilter = {};

      // 🔹 Filtrar por nombre (coincidencias parciales, insensible a mayúsculas)
      if (name) {
        filter.name = { $regex: String(name), $options: "i" };
      }

      // 🔹 Filtrar por nacionalidad
      if (nationality) {
        filter.nationality = { $regex: String(nationality), $options: "i" };
      }

      // 🔹 Filtrar por si está activo o no
      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }

      const authors = await Author.find(filter);
      res.status(200).json({ ok: true, data: authors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al obtener autores" });
    }
  }

  // --- 📍 MÉTODO POST: Crear un nuevo autor ---
  else if (req.method === "POST") {
    try {
      const { name, nationality, birthYear, isActive, authorId } = req.body;

      // Si no envían un authorId, lo generamos automáticamente
      let nextAuthorId = authorId;
      if (!authorId) {
        const lastAuthor = await Author.findOne().sort({ authorId: -1 });
        nextAuthorId = lastAuthor ? lastAuthor.authorId + 1 : 1;
      }

      const newAuthor = new Author({
        authorId: nextAuthorId,
        name,
        nationality,
        birthYear,
        isActive,
      });

      await newAuthor.save();
      res.status(201).json({ ok: true, data: newAuthor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al crear autor" });
    }
  }

  // --- 📍 MÉTODO PUT: Actualizar un autor por _id o authorId ---
  else if (req.method === "PUT") {
    try {
      const { _id, authorId, ...rest } = req.body;

      if (!_id && !authorId) {
        return res.status(400).json({ ok: false, message: "Se requiere _id o authorId" });
      }

      const query = _id ? { _id } : { authorId };
      const updated = await Author.findOneAndUpdate(query, rest, { new: true });

      if (!updated) {
        return res.status(404).json({ ok: false, message: "Autor no encontrado" });
      }

      res.status(200).json({ ok: true, data: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al actualizar autor" });
    }
  }

  // === DELETE: eliminar autor por _id o authorId ===
  if (req.method === "DELETE") {
    try {
      // Leer parámetros desde query o body
      const rawId = req.query._id ?? (req.body && (req.body as { _id?: string })._id);
      const rawAuthorId =
        req.query.authorId ?? (req.body && (req.body as { authorId?: number | string }).authorId);

      // Validar que tengamos al menos uno
      if (!rawId && (rawAuthorId === undefined || rawAuthorId === null || rawAuthorId === "")) {
        return res.status(400).json({ ok: false, message: "Se requiere _id o authorId" });
      }

      // Creamos el filtro tipado
      let filter: Record<string, string | number> = {};

      // Si viene _id, validamos que sea ObjectId válido
      if (rawId) {
        const idStr = String(rawId);
        if (!mongoose.Types.ObjectId.isValid(idStr)) {
          return res.status(400).json({ ok: false, message: "_id inválido" });
        }
        filter = { _id: idStr };
      } else {
        // Convertir authorId a número
        const maybeNum = Number(rawAuthorId);
        if (Number.isNaN(maybeNum)) {
          return res.status(400).json({ ok: false, message: "authorId debe ser un número válido" });
        }
        filter = { authorId: maybeNum };
      }

      console.log("[DELETE /api/authors] Filtro:", filter);

      // Buscar el autor
      const foundAuthor = await Author.findOne(filter);
      if (!foundAuthor) {
        return res.status(404).json({ ok: false, message: "Autor no encontrado" });
      }

      // Eliminar el autor
      const deletedAuthor = await Author.findOneAndDelete(filter);

      return res
        .status(200)
        .json({ ok: true, message: "Autor eliminado correctamente", data: deletedAuthor });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error en DELETE /api/authors:", error.message);
        return res.status(500).json({ ok: false, message: error.message });
      }

      // Error genérico (nunca deberías llegar aquí si todo está bien)
      return res.status(500).json({ ok: false, message: "Error desconocido" });
    }
  }
  
  // --- 📍 Si usan otro método (PATCH, OPTIONS, etc.) ---
  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ ok: false, message: `Método ${req.method} no permitido` });
  }
}
