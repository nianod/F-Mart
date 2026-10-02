import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUrl = process.env.MONGO_URI  
  if (!mongoUrl) throw new Error("MONGO_URL is required");
  await mongoose.connect(mongoUrl);
  console.log("MongoDB connected");
}
