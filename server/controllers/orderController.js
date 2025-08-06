import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get cart and validate
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    if (!cart?.items?.length) {
      return next(createError(400, "Cart is empty"));
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return next(
          createError(400, `Insufficient stock for ${item.productId.name}`)
        );
      }
    }

    // Calculate totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.price,
        quantity: item.quantity,
        image: item.productId.images[0]?.url || "",
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
    });

    await order.save();

    // Update product stock
    await Promise.all(
      cart.items.map((item) =>
        Product.findByIdAndUpdate(item.productId._id, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order },
    });
  } catch (error) {
    next(createError(500, "Failed to create order"));
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.productId", "name images"),
      Order.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
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
