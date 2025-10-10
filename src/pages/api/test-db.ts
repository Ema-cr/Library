import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbconnection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    res.status(200).json({ ok: true, message: "✅ Conexión exitosa con MongoDB" });
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    res.status(500).json({ ok: false, message: "Error en conexión", error });
  }
}
