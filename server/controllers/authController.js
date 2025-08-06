import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User already exists with this email"));
    }

    const user = new User({ name, email, password, phone, role });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(createError(500, "Registration failed"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "Invalid email or password"));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid email or password"));
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(createError(500, "Login failed"));
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          address: req.user.address,
        },
      },
    });
  } catch (error) {
    next(createError(500, "Failed to get profile"));
  }
};
