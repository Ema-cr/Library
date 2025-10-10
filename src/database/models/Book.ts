import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  idBook: number;
  title: string;
  authorId: number; 
  category?: string;
  publishedYear?: number;
  availableCopies: number;
  img?: string;
  createdAt: Date;
}

const urlRegex = /^https?:\/\/.+\..+/i;

const BookSchema: Schema = new Schema({
  idBook: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  authorId: { type: Number, required: true, ref: "Author" },
  category: { type: String },
  publishedYear: { type: Number },
  availableCopies: { type: Number, default: 1 },
  img: {
    type: String,
    validate: {
      validator: function (v: string) {
        if (!v) return true; // opcional
        return urlRegex.test(v);
      },
      message: "img debe ser una URL válida",
    },
  },
  createdAt: { type: Date, default: Date.now },
});


BookSchema.virtual("author", {
  ref: "Author",
  localField: "authorId",
  foreignField: "authorId",
  justOne: true,
});

BookSchema.set("toObject", { virtuals: true });
BookSchema.set("toJSON", { virtuals: true });

export default mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);

