import Contact from "../models/Contact.js";
import { createError } from "../utils/error.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    // Send email notification to admin (implement later)
    // await sendAdminNotification(contact);

    res.status(201).json({
      success: true,
      message: "Message received successfully",
      data: { contact },
    });
  } catch (error) {
    next(createError(500, "Failed to submit message"));
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select("-response"); // Exclude response field for security

    res.status(200).json({
      success: true,
      data: { contacts },
    });
  } catch (error) {
    next(createError(500, "Failed to fetch messages"));
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, response },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return next(createError(404, "Message not found"));
    }

    res.status(200).json({
      success: true,
      message: "Message status updated",
      data: { contact },
    });
  } catch (error) {
    next(createError(500, "Failed to update message status"));
  }
};
