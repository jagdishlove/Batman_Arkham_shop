// models/order.js

import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// Generates a unique, hard-to-guess order number like BAT-8K4D2N1P
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

const OrderSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order Details
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => `BAT-${nanoid()}`,
    },

    // Items with product snapshot
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        price: Number,
      },
    ],

    // Price Breakdown
    subtotal: Number,
    tax: Number,
    shipping: Number,
    total: Number,

    // Shipping Details
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
    },

    // Payment Details
    payment: {
      method: {
        type: String,
        enum: ["credit_card", "paypal", "cod"],
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },

    // Order Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
