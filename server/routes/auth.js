import express from "express";
import { authenticate } from "../middleware/auth.js";
import { register, login, getProfile } from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;
