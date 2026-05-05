import express from "express";
import "./config/env.js";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import testRoutes from "./routes/testRoutes.js";

// 🔐 Load environment variables FIRST
// dotenv.config();

// ⚠️ Safety check for critical env
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing in .env file");
}


// 📦 Connect DB
connectDB();

// 🔍 Debug (remove in production later)
console.log("✅ GEMINI KEY LOADED:", !!process.env.GEMINI_API_KEY);
console.log("🔑 KEY LENGTH:", process.env.GEMINI_API_KEY?.length);

const app = express();

// 🌐 CORS config (better practice)
app.use(
  cors({
    origin: "*", // later replace with frontend domain
    credentials: true,
  })
);

// 📦 Middlewares
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🏠 Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🚀 Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/chatbot", chatRoutes);
app.use("/api/test", testRoutes);

// 🚀 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});