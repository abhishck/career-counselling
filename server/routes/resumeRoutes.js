import express from "express";
import { analyzeResume } from "../controllers/resumeController.js";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route + file upload
router.post("/analyze", protect, upload.single("resume"), analyzeResume);

export default router;