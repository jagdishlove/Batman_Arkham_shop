import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  register,
  login,
  getProfile,
  getTotalUsers,
  toggleUserStatus,
  updatePassword,
  getAllUsers,
  verifyEmail,
  verifySecurityAnswer,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.patch("/update-password", authenticate, updatePassword);
router.patch("/users/deactivate", authenticate, toggleUserStatus);
router.post("/forgot-password/verify-email", verifyEmail);
router.post("/forgot-password/verify-security", verifySecurityAnswer);
router.post("/forgot-password/reset", resetPassword);

// Admin routes
router.get("/users/stats", authenticate, authorizeAdmin, getTotalUsers);
router.get("/users", authenticate, authorizeAdmin, getAllUsers);

export default router;
