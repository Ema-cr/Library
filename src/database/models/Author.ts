import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor extends Document {
  authorId: number; 
  name: string;
  nationality?: string;
  birthYear?: number;
  isActive: boolean;
}

const AuthorSchema: Schema = new Schema({
  authorId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  nationality: { type: String },
  birthYear: { type: Number },
  isActive: { type: Boolean, default: true },
});

export default mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);
