import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxLength: [100, "Subject cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxLength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "read", "responded"],
      default: "pending",
    },
    response: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
