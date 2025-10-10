import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbconnection";
import User from "@/database/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // --- GET: listar todos los usuarios ---
  if (req.method === "GET") {
    try {
      const users = await User.find();
      res.status(200).json({ ok: true, data: users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al obtener usuarios" });
    }
  }

  // --- POST: crear usuario ---
  else if (req.method === "POST") {
    try {
      const { username, password, id } = req.body;

      if (!username || !password) {
        return res.status(400).json({ ok: false, message: "username y password son obligatorios" });
      }

      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ ok: false, message: "Usuario ya existe" });

      // Generar id si no se proporciona
      let nextId = id;
      if (!id) {
        const lastUser = await User.findOne().sort({ id: -1 });
        nextId = lastUser ? lastUser.id + 1 : 1;
      }

      const newUser = new User({ username, password, id: nextId });
      await newUser.save();
      res.status(201).json({ ok: true, data: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al crear usuario" });
    }
  }

  // --- PUT: actualizar usuario por id ---
  else if (req.method === "PUT") {
    try {
      const { id, username, password } = req.body;
      if (id === undefined) return res.status(400).json({ ok: false, message: "id es obligatorio" });

      const updated = await User.findOneAndUpdate({ id }, { username, password }, { new: true });
      if (!updated) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

      res.status(200).json({ ok: true, data: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al actualizar usuario" });
    }
  }

  // --- DELETE: eliminar usuario por id ---
  else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (id === undefined) return res.status(400).json({ ok: false, message: "id es obligatorio" });

      const deleted = await User.findOneAndDelete({ id: Number(id) });
      if (!deleted) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

      res.status(200).json({ ok: true, message: "Usuario eliminado correctamente", data: deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: "Error al eliminar usuario" });
    }
  }

  else {
    res.setHeader("Allow", ["GET","POST","PUT","DELETE"]);
    res.status(405).json({ ok: false, message: `Método ${req.method} no permitido` });
  }
}
