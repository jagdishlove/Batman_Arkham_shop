import Order from "../models/order.js";
import { createOrder } from "../services/orderService.js";
import { createError } from "../utils/error.js";

export const createOrderHandler = async (req, res, next) => {
  try {
    const { items, shippingAddress, payment, subtotal, tax, shipping, total } =
      req.body;
    const userId = req.user.id;

    const order = await createOrder(
      {
        items,
        shippingAddress,
        payment,
        subtotal,
        tax,
        shipping,
        total,
      },
      userId
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.product",
        model: "Product",
        select: "name price images description category",
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(createError(500, "Failed to fetch orders"));
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId", "name images");

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch order"));
  }
};
