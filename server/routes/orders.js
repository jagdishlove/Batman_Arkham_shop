import express from "express"
import Order from "../models/Order.js"
import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Create order
router.post("/create", authenticate, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body

    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      })
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productId.name}`,
        })
      }
    }

    const subtotal = cart.totalAmount
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

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
    })

    await order.save()

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      })
    }

    // Clear cart
    cart.items = []
    await cart.save()

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    })
  }
})

// Get user orders
router.get("/", authenticate, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.productId", "name images")

    const total = await Order.countDocuments({ userId: req.user._id })

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
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    })
  }
})

// Get single order
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId", "name images")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    res.json({
      success: true,
      data: { order },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    })
  }
})

export default router
