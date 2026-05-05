import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// GET profile
router.get("/profile", protect, getUserProfile);

// UPDATE profile
router.put("/profile", protect, updateUserProfile);

export default router;