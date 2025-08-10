import Order from "../models/Order.js";

export const createOrder = async (orderData, userId) => {
  const order = new Order({
    user: userId,
    ...orderData,
    status: "pending",
  });

  return await order.save();
};
