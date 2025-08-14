import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  register,
  login,
  getProfile,
  getTotalUsers,
  toggleUserStatus,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.patch("/update-password", authenticate, updatePassword);
router.patch("/users/deactivate", authenticate, toggleUserStatus);

// Admin routes
router.get("/users/stats", authenticate, authorizeAdmin, getTotalUsers);

export default router;
