import { useState } from "react";
import { useStandardQuery } from "@/lib/useStandardQuery";
import { get } from "@/lib/http";
import { Shield } from "lucide-react";
import { formatDate, formatPrice } from "../utils";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-blue-500/20 text-blue-500",
  shipped: "bg-purple-500/20 text-purple-500",
  delivered: "bg-green-500/20 text-green-500",
};

const OrderCard = ({ order }) => (
  <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
    <div className="p-4 border-b border-gray-800">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-400">Order #{order.orderNumber}</p>
          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs uppercase ${
            statusColors[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>

    <div className="p-4">
      {order.items.map((item) => (
        <div key={item._id} className="flex gap-4 mb-4">
          <div className="flex-1">
            <h4 className="font-medium text-white">{item.product.name}</h4>
            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
            <p className="text-sm text-yellow-400">
              {formatPrice(item.product.price)}
            </p>
          </div>
        </div>
      ))}

      <div className="border-t border-gray-800 mt-4 pt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Tax</span>
          <span className="text-white">{formatPrice(order.tax)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Shipping</span>
          <span className="text-white">{formatPrice(order.shipping)}</span>
        </div>
        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-800">
          <span>Total</span>
          <span className="text-yellow-400">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  </div>
);

const OrderHistory = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useStandardQuery("orders", () => get("/orders"), {
    errorMsg: "Failed to fetch orders",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-white mb-2">
          Failed to Load Orders
        </h2>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-medium text-white mb-2">No Orders Yet</h2>
        <p className="text-gray-400">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-light mb-8">ORDER HISTORY</h1>
        <div className="grid gap-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
