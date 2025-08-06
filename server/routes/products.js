import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
