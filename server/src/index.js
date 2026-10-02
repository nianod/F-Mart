import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({ credentials: true }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "FoodMart API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use(notFound);
app.use(errorHandler);

connectDatabase()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => {
    console.error("Unable to start FoodMart API:", error.message);
    process.exit(1);
  });
