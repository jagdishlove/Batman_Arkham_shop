import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getUserOrders,
  getOrderById,
  createOrderHandler,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", authenticate, createOrderHandler);
router.get("/", authenticate, getUserOrders);
router.get("/:id", authenticate, getOrderById);

export default router;
