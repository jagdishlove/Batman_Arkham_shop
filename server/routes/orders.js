import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import {
  getUserOrders,
  getOrderById,
  createOrderHandler,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", authenticate, createOrderHandler);
router.get("/", authenticate, getUserOrders);
router.get("/all", authenticate, authorizeAdmin, getAllOrders);
router.patch(
  "/update/:orderId",
  authenticate,
  authorizeAdmin,
  updateOrderStatus
);
router.get("/:id", authenticate, getOrderById);

export default router;
