import mongoose, { Schema, Document } from "mongoose";
import Author from "./Author"; // para la relación

export interface IBook extends Document {
  idBook: string; // único
  title: string;
  authorId: number; // referencia con Author
  category: string;
  publishedYear: number;
  availableCopies: number;
  img: string;
  createdAt: Date;
}

// Validar URL (para img)
const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

const BookSchema: Schema<IBook> = new Schema({
  idBook: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  authorId: { type: Number, required: true, ref: "Author" }, // relación
  category: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  availableCopies: { type: Number, required: true },
  img: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: "La URL de la imagen no es válida",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// --- 🔗 Virtual populate ---
// Permite acceder directamente a los datos del autor desde un libro
BookSchema.virtual("author", {
  ref: "Author",
  localField: "authorId",   // campo en Book
  foreignField: "authorId", // campo en Author
  justOne: true,            // un solo autor por libro
});

// Para que el virtual se incluya al convertir a JSON u objeto
BookSchema.set("toObject", { virtuals: true });
BookSchema.set("toJSON", { virtuals: true });

export default mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
