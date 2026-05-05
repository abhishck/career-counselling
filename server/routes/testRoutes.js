import express from "express";
import { getQuestions, submitTest ,getUserResults, } from "../controllers/testController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitTest);
router.get("/results", protect, getUserResults);

export default router;