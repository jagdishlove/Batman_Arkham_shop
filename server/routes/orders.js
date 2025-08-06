import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.get("/", authenticate, getUserOrders);
router.get("/:id", authenticate, getOrderById);

export default router;
