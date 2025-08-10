import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await user.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  // We check if req.user was set by the authenticate middleware
  // and if the user's role is 'admin'
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed to the route handler
  } else {
    // If not an admin, send a 'Forbidden' error
    res.status(403).json({
      success: false,
      message: "Forbidden. You do not have permission to perform this action.",
    });
  }
};
