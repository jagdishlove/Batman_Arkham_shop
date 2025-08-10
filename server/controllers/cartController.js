import Cart from "../models/cart.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch cart"));
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return next(createError(404, "Product not found"));
    }

    if (product.stock < quantity) {
      return next(createError(400, "Insufficient stock"));
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Product added to cart",
      data: { cart },
    });
  } catch (error) {
    next(createError(500, "Failed to add to cart"));
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return next(createError(404, "Item not found in cart"));
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Cart updated",
      data: { cart },
    });
  } catch (error) {
    next(createError(500, "Failed to update cart"));
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Item removed from cart",
      data: { cart },
    });
  } catch (error) {
    next(createError(500, "Failed to remove from cart"));
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(createError(404, "Cart not found"));
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared",
      data: { cart },
    });
  } catch (error) {
    next(createError(500, "Failed to clear cart"));
  }
};
