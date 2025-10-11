// ------------------- Users -------------------
export interface IUser {
  id: number;           // el ID propio que tienes en la DB
  username: string;
  password: string;
  createdAt: string;    // fecha como string porque viene de la API JSON
}

// ------------------- Authors -------------------
export interface IAuthor {
  authorId: number;
  name: string;
  nationality: string;
  birthYear: number;
  isActive: boolean;
  createdAt: string;    // fecha como string
}

// ------------------- Books -------------------
export interface IBook {
  _id: string;
  idBook: string;
  title: string;
  authorId: number;
  category: string;
  publishedYear: number;
  availableCopies: number;
  img: string;
  createdAt: string;
  author?: IAuthor;     // populate del autor
}
