import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  submitContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contactController.js";

const router = express.Router();

// Public routes
router.post("/submit", submitContact);

// Admin only routes
router.get("/", authenticate, authorize("admin"), getContacts);
router.patch("/:id", authenticate, authorize("admin"), updateContactStatus);

export default router;
