import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: skip + limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch products"));
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return next(createError(404, "Product not found"));
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch product"));
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isActive: true })
      .sort({ "rating.average": -1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { products },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch featured products"));
  }
};

export const createProduct = async (req, res, next) => {
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

    // Validate required fields
    if (!name || !price || !category) {
      return next(createError(400, "Missing required fields"));
    }

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
      data: { product },
    });
  } catch (error) {
    next(createError(500, "Failed to create product"));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    next(createError(500, "Failed to update product"));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(createError(500, "Failed to delete product"));
  }
};
