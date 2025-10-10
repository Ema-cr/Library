import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MISSING_ENV: define MONGODB_URI in your .env");
}


export default async function dbConnect(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return; 

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
