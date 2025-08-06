import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Cart routes
router.get("/", authenticate, getCart);
router.post("/add", authenticate, addToCart);
router.put("/update", authenticate, updateCartItem);
router.delete("/remove/:productId", authenticate, removeFromCart);
router.delete("/clear", authenticate, clearCart);

export default router;
