import app, { connectDB } from "../server/index.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Serverless database connection error:", error);
  }
  return app(req, res);
}
