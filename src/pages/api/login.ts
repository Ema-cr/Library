// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbconnection";
import User from "@/database/models/User";

interface LoginRequest {
  username: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: `Método ${req.method} no permitido` });
  }

  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "Usuario y contraseña requeridos" });
    }

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ ok: false, message: "Usuario o contraseña incorrectos" });
    }

    // Login correcto, retornamos info básica (sin la contraseña)
    return res.status(200).json({
      ok: true,
      data: { id: user.id, username: user.username, createdAt: user.createdAt },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "Error al iniciar sesión" });
  }
}
