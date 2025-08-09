import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  submitContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contactController.js";

const router = express.Router();

// Public routes
router.post("/submit", submitContact);

// Admin only routes
router.get("/", authenticate, authorizeAdmin, getContacts);
router.patch("/:id", authenticate, authorizeAdmin, updateContactStatus);

export default router;
