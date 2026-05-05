import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  chatWithAI,
  getChatHistory,
} from "../controllers/chatController.js";

const router = express.Router();

// Send message
router.post("/", protect, chatWithAI);

// Get all chats
router.get("/history", protect, getChatHistory);

export default router;