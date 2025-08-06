import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get all products (no filters, no pagination)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// Get featured products
router.get("/featured/list", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 8;
    const products = await Product.find({ isActive: true })
      .sort({ "rating.average": -1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error.message,
    });
  }
});

// Admin: Create product
router.post("/create", async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      description,
      rating,
      stock,
      inStock,
      images,
      tags,
    } = req.body;

    const product = new Product({
      name,
      price,
      originalPrice,
      category,
      description,
      rating,
      stock,
      inStock,
      images,
      tags,
      isActive: true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

export default router;
