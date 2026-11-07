import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());

// Mongoose connection caching for serverless environments (Vercel) & local
let isConnected = false;
export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  if (!process.env.MONGODB) {
    console.error("MONGODB environment variable is not defined!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Database connection middleware for API requests
app.use(async (req, res, next) => {
  if (req.originalUrl?.startsWith("/api") || req.url?.startsWith("/api")) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/admin", adminRoutes);

// Static file serving for local standalone runs
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Only start standalone HTTP server when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  connectDB().catch(console.error);
  const PORT = process.env.PORT || 1337;
  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

export default app;
