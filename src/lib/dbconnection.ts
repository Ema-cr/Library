import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnection() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log("MongoDB connected:", db.connection.name);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
