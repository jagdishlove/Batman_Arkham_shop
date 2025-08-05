import express from "express"
import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get cart
router.get("/", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId")

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] })
      await cart.save()
    }

    res.json({
      success: true,
      data: { cart },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    })
  }
})

// Add to cart
router.post("/add", authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      })
    }

    let cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] })
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      })
    }

    await cart.save()
    await cart.populate("items.productId")

    res.json({
      success: true,
      message: "Product added to cart",
      data: { cart },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error.message,
    })
  }
})

// Update cart item
router.put("/update", authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      })
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()
    await cart.populate("items.productId")

    res.json({
      success: true,
      message: "Cart updated",
      data: { cart },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    })
  }
})

// Remove from cart
router.delete("/remove/:productId", authenticate, async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId)

    await cart.save()
    await cart.populate("items.productId")

    res.json({
      success: true,
      message: "Item removed from cart",
      data: { cart },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
      error: error.message,
    })
  }
})

// Clear cart
router.delete("/clear", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      })
    }

    cart.items = []
    await cart.save()

    res.json({
      success: true,
      message: "Cart cleared",
      data: { cart },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    })
  }
})

export default router
