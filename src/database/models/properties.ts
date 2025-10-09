import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  authorId: {
    type: Number,
    unique: true, // Debe ser único
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nationality: String,
  birthYear: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Creamos el modelo
const Author = mongoose.model("Author", authorSchema);

export default Author;
