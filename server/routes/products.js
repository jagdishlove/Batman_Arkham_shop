import express from "express"
import Product from "../models/Product.js"

const router = express.Router()

// Get all products
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const filter = { isActive: true }

    if (req.query.category && req.query.category !== "all") {
      filter.category = new RegExp(req.query.category, "i")
    }

    if (req.query.search) {
      filter.$or = [{ name: new RegExp(req.query.search, "i") }, { description: new RegExp(req.query.search, "i") }]
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {}
      if (req.query.minPrice) filter.price.$gte = Number.parseFloat(req.query.minPrice)
      if (req.query.maxPrice) filter.price.$lte = Number.parseFloat(req.query.maxPrice)
    }

    let sort = { createdAt: -1 }
    if (req.query.sort === "price_low") sort = { price: 1 }
    else if (req.query.sort === "price_high") sort = { price: -1 }
    else if (req.query.sort === "rating") sort = { "rating.average": -1 }

    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit)
    const total = await Product.countDocuments(filter)

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      data: { product },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    })
  }
})

// Get featured products
router.get("/featured/list", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 8
    const products = await Product.find({ isActive: true }).sort({ "rating.average": -1, createdAt: -1 }).limit(limit)

    res.json({
      success: true,
      data: { products },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error.message,
    })
  }
})

export default router
